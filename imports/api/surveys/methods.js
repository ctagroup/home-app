import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import { getScoringVariables, iterateItems } from '/imports/api/surveys/computations';
import Surveys from '/imports/api/surveys/surveys';
import {
  mapUploadedSurveySections,
  updateDefinitionFromDoc, updateDocFromDefinition } from '/imports/api/surveys/helpers';

Meteor.methods({
  'surveys.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.create`, doc);
    check(doc, Surveys.schema);
    // TODO: permissions check
    const id = Surveys.insert(doc);

    try {
      Meteor.call('surveys.uploadQuestions', id);
      Meteor.call('surveys.upload', id);
      // remove local survey uplon successful upload
      Surveys.remove(id);
    } catch (e) {
      logger.error(`Failed to upload survey ${e}`);
      throw new Meteor.Error('hmis.api', `Survey created, failed to upload! ${e}`);
    }
    return id;
  },

  'surveys.update'(id, doc) {
    logger.info(`METHOD[${this.userId}]: surveys.update`, id, doc);

    // TODO: permissions
    check(id, String);

    const hc = HmisClient.create(this.userId);

    let tempId;
    let uploadedSurvey;
    try {
      const survey = hc.api('survey2').getSurvey(id);
      uploadedSurvey = updateDocFromDefinition({
        ...survey,
        definition: survey.surveyDefinition,
      });
    } catch (err) {
      uploadedSurvey = {
        surveyTitle: 'temp survey',
        locked: true,
      };
    }

    if (doc.$set) {
      // survey definition updated in builder
      tempId = Surveys.insert({
        ...doc.$set,
        title: uploadedSurvey.surveyTitle,
        locked: uploadedSurvey.locked,
        hmis: {
          surveyId: uploadedSurvey ? id : undefined,
        },
        hudSurvey: uploadedSurvey.hudSurvey,
        surveyVersion: uploadedSurvey.surveyVersion,
      });
    } else {
      // survey updated via edit form
      tempId = Surveys.insert({
        ...doc,
        hmis: {
          surveyId: uploadedSurvey.surveyId,
        },
      });
    }

    try {
      Meteor.call('surveys.uploadQuestions', tempId);
      Meteor.call('surveys.upload', tempId);
      Surveys.remove(id);
    } catch (e) {
      logger.error(`Failed to upload survey ${e}`);
      throw new Meteor.Error('hmis.api', `Survey created, failed to upload! ${e}`);
    } finally {
      // remove temp survey
      Surveys.remove(tempId);
    }
    return true;
  },

  'surveys.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: surveys.delete`, id);
    check(id, String);
    // TODO: permissions check
    const numRemoved = Surveys.remove(id);
    if (numRemoved === 0) {
      const hc = HmisClient.create(this.userId);
      return hc.api('survey2').deleteSurvey(id);
    }
    return numRemoved;
  },

  'surveys.uploadQuestions'(id) {
    const hc = HmisClient.create(Meteor.userId());
    const survey = Surveys.findOne(id);
    const definition = JSON.parse(survey.definition);

    // TODO: make sure question group exists
    const groups = hc.api('survey').getQuestionGroups();
    let groupId;
    if (groups.length === 0) {
      groupId = hc.api('survey').createQuestionGroup('default');
    } else {
      groupId = groups[0].questionGroupId;
      logger.debug('uploading questions to group', groupId);
    }

    const results = {
      created: [],
      skipped: [],
    };

    iterateItems(definition, (item) => {
      const itemDefinition = { ...item };
      delete itemDefinition.hmisId;
      delete itemDefinition.rules;
      if (item.type === 'question' || item.type === 'grid') {
        if (!item.hmisId) {
          const questionType = item.type === 'question' ? item.category : 'grid';
          const question = hc.api('survey2').createQuestion(groupId, {
            displayText: item.title,
            questionDescription: item.text,
            questionType,
            definition: JSON.stringify(itemDefinition),
            visibility: true,
            category: survey.title,
            subcategory: '',
          });
          item.hmisId = question.questionId; // eslint-disable-line
          results.created.push({
            id: item.id,
            hmisId: item.hmisId,
          });
        } else {
          results.skipped.push({
            id: item.id,
            hmisId: item.hmisId,
          });
        }
      }
    });
    logger.debug('question upload results', results);
    Surveys.update(id, { $set: { definition: JSON.stringify(definition) } });
    return results;
  },

  'surveys.upload'(id) {
    const hc = HmisClient.create(Meteor.userId());
    const survey = updateDefinitionFromDoc(Surveys.findOne(id));
    const definition = JSON.parse(survey.definition);
    let hmis;
    let surveyId;

    // upload survey to hmis
    if (survey.hmis && survey.hmis.surveyId) {
      surveyId = survey.hmis.surveyId;
      logger.info(`Uploading existing survey ${survey.title} (${surveyId})`);
      hc.api('survey2').updateSurvey(surveyId, survey);
      hmis = survey.hmis;
    } else {
      logger.info(`Uploading survey ${survey.title} (${id}) for the first time`);
      surveyId = hc.api('survey2').createSurvey(survey).surveyId;
      hmis = Object.assign({}, survey.hmis, {
        surveyId,
      });
    }

    // create survey section for each scoring variable
    const surveySectionsResponse = hc.api('survey').getSurveySections(surveyId);
    const existingSections = mapUploadedSurveySections(surveySectionsResponse);
    logger.debug('existing sections', existingSections);

    const uploadedScoringVariables = new Set(
      existingSections.filter(s => s.type === 'score').map(s => s.id)
    );
    const defaultSection = existingSections.filter(s => s.type === 'default')[0];

    logger.debug('default section', defaultSection);

    logger.debug('all scoring variables', getScoringVariables(definition));

    const allScoringVariables = getScoringVariables(definition).map(v => v.name);
    const newScoringVariables = allScoringVariables.filter(v => !uploadedScoringVariables.has(v));

    logger.debug(`${newScoringVariables.length} new scoring variables`, newScoringVariables);

    if (!defaultSection) {
      // add a default section
      logger.info('creating default section');
      hc.api('survey').createSurveySection(surveyId, {
        sectionText: 'default',
        sectionDetail: 'default section for question responses',
        sectionWeight: 0,
        order: 1,
      });
    }
    newScoringVariables.forEach((v) => {
      logger.info('creating section for variable', v);
      hc.api('survey').createSurveySection(surveyId, {
        sectionText: 'score',
        sectionDetail: v,
        sectionWeight: 1,
        order: 1,
      });
    });
    hmis.status = 'uploaded';
    logger.debug('updating survey HMIS data', hmis);
    Surveys.update(id, { $set: { hmis } });
    return surveyId;
  },
  'surveys.test.getHudQuestions'() {
    // TODO: used only for testing, safe to delete
    const hc = HmisClient.create(this.userId);
    return hc.api('client').getHudQuestions('v2017');
  },
});

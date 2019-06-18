import { HmisClient } from '/imports/api/hmisApi';
import { logger as globalLogger } from '/imports/utils/logger';
import { getScoringVariables, iterateItems } from '/imports/api/surveys/computations';
import Surveys from '/imports/api/surveys/surveys';
import SurveyCaches from '/imports/api/surveys/surveyCaches';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import {
  mapUploadedSurveySections,
  updateDefinitionFromDoc,
  updateDocFromDefinition,
} from '/imports/api/surveys/helpers';
import eventPublisher, {
  SurveyUpdatedEvent,
} from '/imports/api/eventLog/events';

Meteor.methods({
  'surveys.create'(doc) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.create`, doc);
    check(doc, Surveys.schema);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const id = Surveys.insert(doc);
    try {
      Meteor.call('surveys.uploadQuestions', id);
      Meteor.call('surveys.upload', id);
      // remove local survey uplon successful upload
      Surveys.remove(id);
    } catch (e) {
      globalLogger.error(`Failed to upload survey ${e}`);
      throw new Meteor.Error('hmis.api', `Survey created, failed to upload! ${e}`);
    }
    return id;
  },

  'surveys.update'(id, doc) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.update`, id, doc);

    check(id, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

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
      const hmisSurveyId = Meteor.call('surveys.upload', tempId);
      Surveys.remove(id);
      eventPublisher.publish(new SurveyUpdatedEvent(hmisSurveyId, { userId: this.userId }));
    } catch (e) {
      globalLogger.error(`Failed to upload survey ${e}`);
      throw new Meteor.Error('hmis.api', `Survey created, failed to upload! ${e}`);
    } finally {
      // remove temp survey
      Surveys.remove(tempId);
    }
    return true;
  },

  'surveys.delete'(id) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.delete`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const numRemoved = Surveys.remove(id);
    if (numRemoved === 0) {
      const hc = HmisClient.create(this.userId);
      return hc.api('survey2').deleteSurvey(id);
    }
    return numRemoved;
  },

  'surveys.uploadQuestions'(id) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.uploadQuestions`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const survey = Surveys.findOne(id);
    const definition = JSON.parse(survey.definition);

    // make sure question group exists
    const groups = hc.api('survey').getQuestionGroups();
    let groupId;
    if (groups.length === 0) {
      groupId = hc.api('survey').createQuestionGroup('default');
    } else {
      groupId = groups[0].questionGroupId;
      globalLogger.debug('uploading questions to group', groupId);
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
    globalLogger.debug('question upload results', results);
    Surveys.update(id, { $set: { definition: JSON.stringify(definition) } });
    return results;
  },

  'surveys.upload'(id) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.upload`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const survey = updateDefinitionFromDoc(Surveys.findOne(id));
    const definition = JSON.parse(survey.definition);
    let hmis;
    let surveyId;

    // upload survey to hmis
    if (survey.hmis && survey.hmis.surveyId) {
      surveyId = survey.hmis.surveyId;
      globalLogger.info(`Uploading existing survey ${survey.title} (${surveyId})`);
      hc.api('survey2').updateSurvey(surveyId, survey);
      hmis = survey.hmis;
    } else {
      globalLogger.info(`Uploading survey ${survey.title} (${id}) for the first time`);
      surveyId = hc.api('survey2').createSurvey(survey).surveyId;
      hmis = Object.assign({}, survey.hmis, {
        surveyId,
      });
    }

    // create survey section for each scoring variable
    const surveySectionsResponse = hc.api('survey').getSurveySections(surveyId);
    const existingSections = mapUploadedSurveySections(surveySectionsResponse);
    globalLogger.debug('existing sections', existingSections);

    const uploadedScoringVariables = new Set(
      existingSections.filter(s => s.type === 'score').map(s => s.id)
    );
    const defaultSection = existingSections.filter(s => s.type === 'default')[0];

    globalLogger.debug('default section', defaultSection);

    globalLogger.debug('all scoring variables', getScoringVariables(definition));

    const allScoringVariables = getScoringVariables(definition).map(v => v.name);
    const newScoringVariables = allScoringVariables.filter(v => !uploadedScoringVariables.has(v));

    globalLogger.debug(`${newScoringVariables.length} new scoring variables`, newScoringVariables);

    if (!defaultSection) {
      // add a default section
      globalLogger.info('creating default section');
      hc.api('survey').createSurveySection(surveyId, {
        sectionText: 'default',
        sectionDetail: 'default section for question responses',
        sectionWeight: 0,
        order: 1,
      });
    }
    newScoringVariables.forEach((v) => {
      globalLogger.info('creating section for variable', v);
      hc.api('survey').createSurveySection(surveyId, {
        sectionText: 'score',
        sectionDetail: v,
        sectionWeight: 1,
        order: 1,
      });
    });
    hmis.status = 'uploaded';
    globalLogger.debug('updating survey HMIS data', hmis);
    Surveys.update(id, { $set: { hmis } });
    return surveyId;
  },

  reloadSurveys() {
    this.unblock();
    const hc = HmisClient.create(this.userId);
    const surveys = hc.api('survey2').getSurveys() || [];
    const surveysList = surveys.map(s => ({
      surveyId: s.surveyId,
      version: 2,
      title: s.surveyTitle,
      definition: s.surveyDefinition,
      hmis: {
        surveyId: s.surveyId,
        status: 'uploaded',
      },
      createdAt: '',
    }));
    SurveyCaches.rawCollection().insertMany(surveysList, { ordered: false });
  },

  'surveys.getSurveySections'(surveyId) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.getSurveySections`, surveyId);
    check(surveyId, String);
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unathorized');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('survey').getSurveySections(surveyId);
  },

  'surveys.getSurveySectionQuestions'(surveyId) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.getSurveySectionQuestions`, surveyId);
    check(surveyId, String);
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unathorized');
    }

    const hc = HmisClient.create(this.userId);
    const sections = hc.api('survey').getSurveySections(surveyId);
    const sectionQuestions = sections.reduce((acc, { surveySectionId }) => ({
      ...acc,
      [surveySectionId]: hc.api('survey').getQuestionMappings(surveyId, surveySectionId),
    }), {});
    return { sections, sectionQuestions };
  },

  'surveys.getGeocodedLocation'(url) {
    globalLogger.info(`METHOD[${this.userId}]: surveys.getGeocodedLocation`);
    const hc = HmisClient.create(this.userId);
    return hc.api('survey2').getGeocodedLocation(url);
  },
});

Meteor.injectedMethods({
  'surveys.get'(surveyId) {
    const { hmisClient, logger } = this.context;
    logger.info('surveys.get', surveyId);

    const survey = hmisClient.api('survey2').getSurvey(surveyId);
    const definition = JSON.parse(survey.surveyDefinition);
    delete survey.surveyDefinition;
    return {
      ...survey,
      definition: {
        ...definition,
        title: definition.title || survey.surveyTitle,
      },
    };
  },
});

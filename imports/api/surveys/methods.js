import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';

Meteor.methods({
  addSurvey(title, active, copy, surveyCopyID, stype, created, locked) {
    logger.info(`METHOD[${Meteor.userId()}]: addSurvey`);
    const surveyID = Surveys.insert(
      {
        title,
        active,
        copy,
        surveyCopyID,
        stype,
        created,
        locked,
      }
    );
    return surveyID;
  },

  updateSurvey(surveyID, title, stype, active, locked) {
    logger.info(`METHOD[${Meteor.userId()}]: updateSurvey`);
    return Surveys.update(surveyID, { $set: { title, stype, active, locked } });
  },

  updateCreatedSurvey(surveyID, created) {
    logger.info(`METHOD[${Meteor.userId()}]: updateCreatedSurvey`);
    Surveys.update(surveyID, { $set: { created } });
  },

  removeSurvey(surveyID) {
    logger.info(`METHOD[${Meteor.userId()}]: removeSurvey`);
    Surveys.remove({ _id: surveyID });
  },

  addSurveyQuestionMaster(
    surveyTitle,
    surveyID,
    sectionID,
    allowSkip,
    contentType,
    content,
    order
  ) {
    logger.info(`METHOD[${Meteor.userId()}]: addSurveyQuestionMaster`);
    const surveyQues = SurveyQuestionsMaster.insert(
      {
        surveyTitle,
        surveyID,
        sectionID,
        allowSkip,
        contentType,
        content,
        order,
      }
    );
    return surveyQues;
  },

  /*
  updateSurveyQuestionMaster(_id, content) {
    SurveyQuestionsMaster.update({ _id }, { $set: { content } });
  },
  updateSurveyQuestionMasterTitle(id, surveyTitle) {
    return SurveyQuestionsMaster.update(
      { surveyID: id },
      { $set: { surveyTitle } }, { multi: true }
    );
  },
  removeSurveyQuestionMasterSection(id) {
    const order = SurveyQuestionsMaster.findOne({ _id: id });
    const nextOrders = SurveyQuestionsMaster.find(
      {
        surveyID: order.surveyID,
        contentType: 'section',
        order: {
          $gt: order.order,
        },
      }
    ).fetch();

    for (let i = 0; i < nextOrders.length; i += 1) {
      SurveyQuestionsMaster.update(
        { _id: nextOrders[i]._id },
        { $set: { order: nextOrders[i].order - 1 } }
      );
    }
    SurveyQuestionsMaster.remove({ sectionID: id });
    return SurveyQuestionsMaster.remove({ _id: id });
  },
  removeSurveyQuestionMaster(id) {
    const order = SurveyQuestionsMaster.findOne({ _id: id });
    const nextOrders = SurveyQuestionsMaster.find(
      {
        surveyID: order.surveyID,
        sectionID: order.sectionID,
        order: {
          $gt: order.order,
        },
      }
    ).fetch();

    for (let i = 0; i < nextOrders.length; i += 1) {
      SurveyQuestionsMaster.update(
        { _id: nextOrders[i]._id },
        { $set: { order: nextOrders[i].order - 1 } }
      );
    }

    return SurveyQuestionsMaster.remove({ _id: id });
  },
  updateQuestionSection(elementId, sectionId, order) {
    SurveyQuestionsMaster.update(
      { _id: elementId },
      { $set: { sectionID: sectionId, order: order } });    // eslint-disable-line
  },
  updateOrder(selector, incField) {
    SurveyQuestionsMaster.update(
      selector,
      { $inc: { order: incField } },
      { multi: true }
    );
  },
  fixSurveyQuestionMasterOrder(surveyId) {
    const sections = SurveyQuestionsMaster.find(
      { $and: [
        { surveyID: surveyId },
        { contentType: { $eq: 'section' } },
      ] },
      { sort: { order: 1 } }
    ).fetch();
    let sectionCount = 1;
    let questionCount;
    for (let i = 0; i < sections.length; i += 1) {
      SurveyQuestionsMaster.update(
        { _id: sections[i]._id },
        { $set: { order: sectionCount } }
      );
      const questions = SurveyQuestionsMaster.find(
        { sectionID: sections[i]._id },
        { sort: { order: 1 },
        }
      ).fetch();
      questionCount = 1;
      for (let j = 0; j < questions.length; j += 1) {
        SurveyQuestionsMaster.update(
          { _id: questions[j]._id },
          { $set: { order: questionCount } }
        );
        questionCount += 1;
      }
      sectionCount += 1;
    }
  },
  removeSurveyCopyQuestionMaster(surveyCopyTitle) {
    SurveyQuestionsMaster.remove({ surveyTitle: surveyCopyTitle });
  },
  /*
  creatingHMISSurvey(surveyTitle, surveyOwner, tagValue, locked, copySurveyId) {
    const survey = { surveyTitle, surveyOwner, tagValue, locked, copySurveyId };
    return HMISAPI.createSurvey(survey);
  },
  creatingHMISSection(surveyId, sectionText, order) {
    const sectionDetail = '';
    const sectionWeight = 0;
    const surveySection = { sectionText, sectionDetail, sectionWeight, order };
    return HMISAPI.createSection(surveySection, surveyId);
  },
  creatingQuestionMapping(surveyId, sectionId, required, questionId) {
    if (!required || required === 'skip') {
      required = false;   // eslint-disable-line
    }
    const sectionQuestionMappings = { sectionQuestionMappings: [
      { question: { questionId }, required },
    ] };
    if (questionId) {
      return HMISAPI.createSurveyQuestionMappings(surveyId, sectionId, sectionQuestionMappings);
    }
    return false;
  },
  addSectionMongoApiId(_id, apiSurveyServiceId) {
    SurveyQuestionsMaster.update(_id,
      { $set: { apiSurveyServiceId } });
    logger.info('Hmis Survey Section Id Added to mongo');
  },
  addSurveyApiId(_id, apiSurveyServiceId) {
    Surveys.update(_id,
      { $set: { apiSurveyServiceId } });
    logger.info('Hmis Survey Id Added to mongo');
  },
  updatingHmisSurvey(surveyId, surveyTitle, surveyOwner, tagValue, locked, copySurveyId) {
    const survey = { surveyTitle, surveyOwner, tagValue, locked, copySurveyId };
    return HMISAPI.updateHmisSurvey(surveyId, survey);
  },
  updatingHmisSection(surveyId, sectionId, sectionText, order) {
    const sectionDetail = '';
    const sectionWeight = 0;
    const surveySection = { sectionText, sectionDetail, sectionWeight, order };
    return HMISAPI.updateHmisSurveySection(surveySection, surveyId, sectionId);
  },
  updateQuesIdInSqm(_id, apiSurveyServiceId) {
    SurveyQuestionsMaster.update(_id, { $set: { apiSurveyServiceId } });
    logger.info('Hmis Survey Question Id Added to mongo');
  },
  getAllHmisSections(surveyId) {
    return HMISAPI.getHmisSurveySections(surveyId);
  },
  gettingQuesMapping(surveyId, sectionId) {
    return HMISAPI.getHmisSurveyQuestionMappings(surveyId, sectionId);
  },
  deleteQuesMapping(surveyId, sectionId, questionId) {
    return HMISAPI.deleteHmisSurveyQuestionMapping(surveyId, sectionId, questionId);
  },
  deleteHmisSection(surveyId, sectionId) {
    return HMISAPI.deleteHmisSurveySection(surveyId, sectionId);
  },
  deleteQuesMappings(surveyId, sectionId, questionIds) {
    return HMISAPI.deleteQuestionMappings(surveyId, sectionId, questionIds);
  },
  */
});

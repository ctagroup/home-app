import Questions from '/imports/api/questions/questions';
import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.methods({
  addQuestion(
    category, name, question, dataType, options,
    qtype, audience, locked, allowSkip, isCopy, surveyServiceQuesId
  ) {
    logger.info(`METHOD[${Meteor.userId()}]: addQuestion`);
    // TODO: use schema
    Questions.insert(
      {
        category,
        name,
        question,
        options,
        dataType,
        qtype,
        audience,
        surveyServiceQuesId,
        locked,
        allowSkip,
        isCopy,
      }, (err, doc) => {
      if (err) {
        return false;
      }
      logger.debug('Question added', doc);
      return doc;
    }
    );
  },
  updateQuestion(
    questionID,
    category,
    name,
    question,
    dataType,
    options,
    qtype,
    audience,
    locked,
    allowSkip,
    isCopy,
    surveyServiceQuesId
  ) {
    logger.info(`METHOD[${Meteor.userId()}]: updateQuestion`);
    Questions.update(
      questionID, {
        $set: {
          category,
          name,
          question,
          options,
          dataType,
          qtype,
          audience,
          surveyServiceQuesId,
          locked,
          allowSkip,
          isCopy,
        },
      }
    );
  },

  gettingQuestionDetails(questionId) {
    logger.info(`METHOD[${Meteor.userId()}]: gettingQuestionDetails`, questionId);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('survey').getQuestion(questionId);
  },

  deleteOldPickListGroup(pickListGroupId) {
    logger.info(`METHOD[${Meteor.userId()}]: deleteOldPickListGroup`, pickListGroupId);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('survey').deletePickListGroup(pickListGroupId);
  },

  addingPickListGroup(pickListGroup) {
    logger.info(`METHOD[${Meteor.userId()}]: addingPickListGroup`, pickListGroup);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('survey').createPickListGroup(pickListGroup);
  },

  addingPickListValues(pickListGroupId, pickListValues) {
    logger.info(`METHOD[${Meteor.userId()}]: addingPickListValues`);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('survey').createPickListValues(pickListGroupId, pickListValues);
  },

  updatingQuestionSurveyService(question, questionId) {
    logger.info(`METHOD[${Meteor.userId()}]: updateSurveyServiceQuestion`);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('survey').updateQuestion(question, questionId);
  },

  addingQuestionSurveyService(question) {
    logger.info(`METHOD[${Meteor.userId()}]: addingQuestionSurveyService`);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('survey').createQuestions(question);
  },

  deleteQuestion(_id) {
    logger.info(`METHOD[${Meteor.userId()}]: deleteQuestion`, _id);
    const question = Questions.findOne({ _id });
    try {
      const api = HmisClient.create(Meteor.userId()).api('survey');
      if (question.surveyServiceQuesId) {
        const apiQuestion = api.getQuestion(question.surveyServiceQuesId);
        // Get details to see PLG exists for it or not?
        if (apiQuestion.pickListGroupId) {
          logger.info('Deleting question PLG');
          api.deletePickListGroup(apiQuestion.pickListGroupId);
        }
        api.deleteQuestion(question.surveyServiceQuesId);
      }
    } catch (e) {
      logger.error(e);
    }
    // Remove question from Mongo
    Questions.remove(_id);
  },

  putSurveyApiId(_id, surveyServiceQuesId) {
    logger.info(`METHOD[${Meteor.userId()}]: putSurveyApiId`, _id, surveyServiceQuesId);
    Questions.update(_id, { $set: { surveyServiceQuesId } });
    logger.info(`Successfully updated SSQId: ${surveyServiceQuesId}`);
  },
});

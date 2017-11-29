import Questions from '/imports/api/questions/questions';
import { logger } from '/imports/utils/logger';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'questions.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: questions.create`, doc);
    check(doc, Questions.schema);
    // TODO: permissions check
    return Questions.insert(doc);
  },

  'questions.update'(id, doc) {
    logger.info(`METHOD[${Meteor.userId()}]: questions.update`, doc);
    check(id, String);
    check(doc, Questions.schema);
    // TODO: permissions check
    return Questions.update(id, doc);
  },

  'questions.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: questions.delete`, id);
    check(id, String);
    // TODO: permissions check
    return Questions.remove(id);
  },

  'questions.categories'() {
    // TODO: permissions check
    this.unblock();

    this.unblock();

    const query = {
      version: 2,
    };
    const questions = Questions.find(query, {
      fields: {
        questionCategory: true,
      },
    }).fetch();

    const distinct = new Set();
    questions.reduce((d, q) => d.add(q.questionCategory), distinct);
    return Array.from(distinct.values())
      .map(value => ({ value, label: value }));
  },

  'questions.subcategories'(options) {
    // TODO: permissions check
    if (!options.params) {
      return [];
    }

    this.unblock();

    const query = {
      version: 2,
      questionCategory: options.params.questionCategory,
    };

    const questions = Questions.find(query, {
      fields: {
        questionCategory: true,
        questionSubcategory: true,
      },
    }).fetch();

    const distinct = new Set();
    questions.reduce((d, q) => d.add(q.questionSubcategory), distinct);
    return Array.from(distinct.values())
      .map(value => ({ value, label: value }));
  },

  /*
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
  */
});

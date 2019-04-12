import Questions from '/imports/api/questions/questions';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'questions.create'(doc) {
    logger.info(`METHOD[${this.userId}]: questions.create`, doc);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'questions.getPage'({ pageNumber = 0, pageSize = 50, sortBy = [], filterBy = [] }) {
    logger.info(`METHOD[${this.userId}]: questions.getPage(${pageNumber}, ${pageSize}, ${sortBy}, ${filterBy})`); // eslint-disable-line max-len
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    const questions = [];
    const questionsCount = 10;

    return {
      content: questions,
      page: {
        totalPages: Math.ceil(questionsCount / pageSize),
      },
    };
  },

  'questions.update'(id, doc) {
    logger.info(`METHOD[${this.userId}]: questions.update`, doc);
    check(id, String);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
  },

  'questions.delete'(groupId, questionId) {
    logger.info(`METHOD[${this.userId}]: questions.delete`, groupId, questionId);
    check(groupId, String);
    check(questionId, String);

    const hc = HmisClient.create(this.userId);
    return hc.api('survey').deleteQuestion(groupId, questionId);
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

  'questions.createDefaultQuestionGroup'() {
    logger.info(`METHOD[${this.userId}]: questions.createDefaultQuestionGroup`);

    const hc = HmisClient.create(this.userId);
    const groups = hc.api('survey').getQuestionGroups();
    if (groups.length > 0) throw new Meteor.Error('Question group already exists');
    // return hc.api('survey').createQuestionGroup('default');
  },
});

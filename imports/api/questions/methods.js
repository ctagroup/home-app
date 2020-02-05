import Questions from '/imports/api/questions/questions';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import eventPublisher, { UserEvent } from '/imports/api/eventLog/events';


Meteor.methods({
  'questions.create'(doc) {
    logger.info(`METHOD[${this.userId}]: questions.create`, doc);
    // TODO: permissions check
    throw new Meteor.Error('Not yet implemented');
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
    const result = hc.api('survey').deleteQuestion(groupId, questionId);
    eventPublisher.publish(new UserEvent(
      'questions.delete',
      `${groupId} ${questionId}`,
      { userId: this.userId }
    ));
    return result;
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

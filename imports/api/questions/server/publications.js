import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import Questions from '/imports/api/questions/questions';

Meteor.publish('questions.hud', function publishHudQuestions(schema = 'v2017') {
  logger.info(`PUB[${this.userId}]: questions.hud`);

  let stopFunction = false;
  this.unblock();
  this.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);
  const questions = hc.api('client').getQuestions(schema);
  if (stopFunction) return;
  questions.forEach(q => this.added('questions', q.questionId, { ...q, hudQuestion: true }));
  this.ready();
});

Meteor.publish('questions.all', function publishAllQuestions() {
  logger.info(`PUB[${this.userId}]: questions.all`);

  let stopFunction = false;
  this.unblock();
  this.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);
  // console.log(hc.api('survey').listQuestions());
  const groups = hc.api('survey').getQuestionGroups();
  // console.log('groups', groups);
  // console.log('getQuestions', hc.api('client').getQuestions());
  groups.forEach(group => {
    if (stopFunction) return;
    const questions = hc.api('survey2').getQuestions(group.questionGroupId);
    // console.log('QUESTIONS', questions);
    questions.forEach(q => {
      // self.added('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
      this.added('questions', q.questionId, { ...q, questionGroup: group });
    });
    this.ready();
  });
});

Meteor.publish('questions.one', function publishOneQuestion(id) {
  // TODO: use HMIS API instead for v2 questions
  logger.info(`PUB[${this.userId}]: questions.one`, id);
  check(id, String);
  return Questions.find({ _id: id, version: 2 });
});

Meteor.publish('questions.v1', function publishV1Questions() {
  logger.info(`PUB[${this.userId}]: questions.v1`);
  return Questions.find({ version: 1 });
});

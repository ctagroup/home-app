import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
// import Questions from '/imports/api/questions/questions';

Meteor.publish('tags.all', function publishAllTags() {
  logger.info(`PUB[${this.userId}]: tags.all`);

  let stopFunction = false;
  this.unblock();
  this.onStop(() => {
    stopFunction = true;
  });

//   const graphQL = GraphQL.create(this.userId);
  try {
    Meteor.call('tagApi', 'getTags',
      (err, res) => {
        // console.log('getTags', err, res, res.results);
        if (!err) {
          if (stopFunction) return;
          res.results.forEach((tag) => {
            this.added('tags', tag.id, { _id: tag.id, ...tag });
          });
          this.ready();
        }
      });
//     const tags = graphQLAPI.getTags() || [];
//     tags.forEach(tag => {
//       if (stopFunction) return;
//       this.added('tags', tag.tagId, tag);
// //       const questions = hc.api('survey2').getQuestions(group.questionGroupId) || [];
// //       questions.forEach(q => {
// //         // self.added('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
// //         this.added('questions', q.questionId, { ...q, questionGroup: group });
// //       });
//       this.ready();
//     });
  } catch (e) {
    logger.warn(e);
  }
  return this.ready();
});

// Meteor.publish('questions.one', function publishOneTag(id) {
//   logger.info(`PUB[${this.userId}]: questions.one`, id);
//   check(id, String);
//   return Questions.find({ _id: id, version: 2 });
// });

Meteor.publish('clientTags.all', function publishAllClientTags(clientId) {
  logger.info(`PUB[${this.userId}]: clientTags.all for ${clientId}`);

  let stopFunction = false;
  this.unblock();
  this.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);
  const clientVersions = hc.api('client').searchClient(clientId);
  if (!clientVersions.length) return this.ready();

  const { dedupClientId } = clientVersions[0];

  try {
    Meteor.call('tagApi', 'getTagsForClient', dedupClientId,
      (err, res) => {
        console.log('getTagsForClient', err, res);
        if (!err) {
          if (stopFunction) return;
          res.forEach((tag) => {
            this.added('clientTags', tag.id, { _id: tag.id, ...tag });
          });
          this.ready();
        }
      });
//     const tags = graphQLAPI.getTags() || [];
//     tags.forEach(tag => {
//       if (stopFunction) return;
//       this.added('clientTags', `client-${tag.tagId}`,
//         { _id: `client-${tag.tagId}`, tagId: tag.tagId, appliedOn: Date.now(), action: 1 });
// //       const questions = hc.api('survey2').getQuestions(group.questionGroupId) || [];
// //       questions.forEach(q => {
// //         // self.added('housingUnits', housingUnits[i].housingInventoryId, housingUnits[i]);
// //         this.added('questions', q.questionId, { ...q, questionGroup: group });
// //       });
//       this.ready();
//     });
  } catch (e) {
    logger.warn(e);
  }
  return this.ready();
});

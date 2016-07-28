/**
 * Created by udit on 07/03/16.
 */
surveyQuestionsMaster = new Meteor.Collection('surveyQuestionsMaster');

Schemas.surveyQuestionsMaster = new SimpleSchema(
  {
    surveyID: {
      type: String,
    },
    surveyTitle: {
      type: String,
    },
    sectionID: {
      type: String,
      optional: true,
    },
    allowSkip: {
      type: String,
      optional: true,
    },
    contentType: {
      type: String,
    },
    content: {
      type: String,
    },
    order: {
      type: Number,
    },
  }
);

surveyQuestionsMaster.attachSchema(Schemas.surveyQuestionsMaster);

surveyQuestionsMaster.allow(
  {
    update(userId, doc, fieldNames, modifier) {
      // if (fieldNames.length !== 1 || fieldNames[0] !== 'order') return false;
      if (! Match.test(modifier, { $set: { order: Number } })) return false;
      return !(typeof Meteor.users !==
      'undefined' &&
      Meteor.users.findOne(
        userId,
        { fields: { Id: 1 } }
      ).Id !== doc.Id);
    },
    insert(userId, doc) {
      return !(typeof Meteor.users !==
      'undefined' &&
      Meteor.users.findOne(
        userId,
        { fields: { Id: 1 } }
      ).Id !== doc.Id);
    },
    remove(userId, doc) {
      return !(typeof Meteor.users !==
      'undefined' &&
      Meteor.users.findOne(
        userId,
        { fields: { Id: 1 } }
      ).Id !== doc.Id);
    },
  }
);

import Questions from '/imports/api/questions/questions';

Meteor.publish('questions', () => Questions.find());

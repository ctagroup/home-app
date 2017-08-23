import Questions from '/imports/api/questions/questions';

Meteor.publish('questions.all', () => Questions.find());

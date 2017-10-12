import './surveyEdit.html';

Template.surveyEdit.helpers({
  schema() {
    return new SimpleSchema({
      title: {
        type: String,
      },
      definition: {
        type: String,
      },
    });
  },

  prettyJSON() {
    const obj = JSON.parse(this.survey.definition);
    return JSON.stringify(obj, null, 2);
  },

  definition() {
    return JSON.parse(this.survey.definition);
  },
});

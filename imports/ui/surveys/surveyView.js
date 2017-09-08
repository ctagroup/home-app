import Surveys from '/imports/api/surveys/surveys';

Template.surveyViewTemplate.helpers(
  {
    surveyList() {
      return Surveys.find().fetch();
    },
  }
);

Template.surveyForm.helpers(
  {
    surveyList() {
      return Surveys.find().fetch();
    },
  }
);

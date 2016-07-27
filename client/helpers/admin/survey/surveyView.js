Template.surveyViewTemplate.helpers(
  {
    surveyList() {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.find({}).fetch();
    },
  }
);

Template.surveyForm.helpers(
  {
    surveyList() {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.find({}).fetch();
    },
  }
);

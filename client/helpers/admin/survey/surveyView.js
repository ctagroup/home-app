Template.surveyViewTemplate.helpers(
  {
    surveyList() {
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.find({}).fetch();
    },
  }
);

Template.surveyForm.helpers(
  {
    surveyList() {
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.find({}).fetch();
    },
  }
);

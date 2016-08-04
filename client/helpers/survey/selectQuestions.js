Session.setDefault('selectedQuestions', null);

Template.selectQuestions.helpers(
  {
    questionList() {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      const surveysCollection = HomeUtils.adminCollectionObject('surveys');
      const survey = surveysCollection.findOne({ _id: Router.current().params._id });
      logger.log(`survey type=${survey.stype}`);
      logger.log(`survey id to select questions=${Router.current().params._id}`);
      if (survey.stype.match('spdat')) {
        return questionCollection.find({ qtype: 'spdat' }).fetch();
      }
      return questionCollection.find({ qtype: survey.stype }).fetch();
    },
  }
);

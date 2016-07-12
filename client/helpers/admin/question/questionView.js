Template.questionViewTemplate.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
  }
);

Template.questionForm.helpers(
  {
    questionList() {
      const questionCollection = adminCollectionObject('questions');
      return questionCollection.find({}).fetch();
    },
    getQuestionCategory() {
      const questionCollection = adminCollectionObject('questions');
      const distinctEntries = _.uniq(
        questionCollection.find(
          {},
          { sort: { category: 1 }, fields: { category: true } }
        ).fetch().map(
          (x) => x.category
        ), true
      );
      return distinctEntries;
    },
  }
);

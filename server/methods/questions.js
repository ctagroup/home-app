/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    addQuestion(
      category, name, question, dataType, options,
      qtype, audience, locked, allowSkip, isCopy, surveyServiceQuesId
    ) {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      questionCollection.insert(
        {
          category,
          name,
          question,
          options,
          dataType,
          qtype,
          audience,
          surveyServiceQuesId,
          locked,
          allowSkip,
          isCopy,
        }
      );
    },
    updateQuestion(
      questionID,
      category,
      name,
      question,
      dataType,
      options,
      qtype,
      audience,
      locked,
      allowSkip,
      isCopy,
      surveyServiceQuesId
    ) {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      questionCollection.update(
        questionID, {
          $set: {
            category,
            name,
            question,
            options,
            dataType,
            qtype,
            audience,
            surveyServiceQuesId,
            locked,
            allowSkip,
            isCopy,
          },
        }
      );
    },
    removeQuestion(questionID) {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      questionCollection.remove({ _id: questionID });
    },
    gettingQuestionDetails(questionId) {
      return HMISAPI.getSurveyServiceQuestion(questionId);
    },
    deleteOldPickListGroup(pickListGroupId) {
      return HMISAPI.deletePickListGroup(pickListGroupId);
    },
    addingPickListGroup(pickListGroup) {
      return HMISAPI.createPickListGroup(pickListGroup);
    },
    addingPickListValues(pickListGroupId, pickListValues) {
      return HMISAPI.createPickListValues(pickListGroupId, pickListValues);
    },
    updatingQuestionSurveyService(question, questionId) {
      return HMISAPI.updateSurveyServiceQuestion(question, questionId);
    },
    addingQuestionSurveyService(question) {
      return HMISAPI.createSurveyServiceQuestions(question);
    },
  }
);

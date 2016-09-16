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
        }, (err, doc) => {
        if (err) {
          return false;
        }
        logger.info(`AddQuestion: ${JSON.stringify(doc)}`);
        return doc;
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
    deleteQuestion(_id) {
      const questionsCollection = HomeUtils.adminCollectionObject('questions');
      const question = questionsCollection.findOne({ _id });
      if (question.surveyServiceQuesId) {
        const apiQuestion = HMISAPI.getSurveyServiceQuestion(question.surveyServiceQuesId);
        // Get details to see PLG exists for it or not?
        if (apiQuestion.pickListGroupId) {
          const temp = HMISAPI.deletePickListGroup(apiQuestion.pickListGroupId);
          logger.info(`Delete Question PLG: ${JSON.stringify(temp)}`);
        }
        const delQuestionResponse =
          HMISAPI.deleteSurveyServiceQuestion(question.surveyServiceQuesId);
        logger.info(`Delete Question : ${JSON.stringify(delQuestionResponse)}`);
      }
      // Removing from Mongo.
      questionsCollection.remove({ _id });
    },
    putSurveyApiId(_id, surveyServiceQuesId) {
      questions.update(_id, { $set: { surveyServiceQuesId } });
      logger.info(`Successfully updated SSQId: ${surveyServiceQuesId}`);
    },
  }
);

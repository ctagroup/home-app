/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    addQuestion(category, name, question, dataType, options, qtype, audience, locked, isCopy) {
      const questionCollection = adminCollectionObject('questions');
      questionCollection.insert(
        {
          category,
          name,
          question,
          options,
          dataType,
          qtype,
          audience,
          locked,
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
      isCopy
    ) {
      const questionCollection = adminCollectionObject('questions');
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
            locked,
            isCopy,
          },
        }
      );
    },
    removeQuestion(questionID) {
      const questionCollection = adminCollectionObject('questions');
      questionCollection.remove({ _id: questionID });
    },
  }
);

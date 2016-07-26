/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    addSurvey(title, active, copy, surveyCopyID, stype, created) {
      const surveyCollection = adminCollectionObject('surveys');
      const surveyID = surveyCollection.insert(
        {
          title,
          active,
          copy,
          surveyCopyID,
          stype,
          created,
        }
      );
      return surveyID;
    },
    updateSurvey(surveyID, title, stype, active) {
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.update(surveyID, { $set: { title, stype, active } });
    },
    updateCreatedSurvey(surveyID, created) {
      const surveyCollection = adminCollectionObject('surveys');
      surveyCollection.update(surveyID, { $set: { created } });
    },
    removeSurvey(surveyID) {
      const surveyCollection = adminCollectionObject('surveys');
      surveyCollection.remove({ _id: surveyID });
    },
    addSurveyQuestionMaster(
      surveyTitle,
      surveyID,
      sectionID,
      allowSkip,
      contentType,
      content,
      order
    ) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const surveyQues = surveyQuestionsMasterCollection.insert(
        {
          surveyTitle,
          surveyID,
          sectionID,
          allowSkip,
          contentType,
          content,
          order,
        }
      );
      return surveyQues;
    },
    updateSurveyQuestionMaster(_id, content) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      surveyQuestionsMasterCollection.update({ _id }, { $set: { content } });
    },
    updateSurveyQuestionMasterTitle(id, surveyTitle) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      return surveyQuestionsMasterCollection.update(
        { surveyID: id },
        { $set: { surveyTitle } }, { multi: true }
      );
    },
    removeSurveyQuestionMaster(id) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');

      const order = surveyQuestionsMasterCollection.findOne({ _id: id });

      const nextOrders = surveyQuestionsMasterCollection.find(
        {
          surveyID: order.surveyID,
          order: {
            $gt: order.order,
          },
        }
      ).fetch();

      for (let i = 0; i < nextOrders.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: nextOrders[i]._id },
          { $set: { order: nextOrders[i].order - 1 } }
        );
      }

      return surveyQuestionsMasterCollection.remove({ _id: id });
    },
    resetSurveyQuestionMasterOrder(surveyId) {
      logger.info(surveyId);

      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const orders = surveyQuestionsMasterCollection.find(
        {
          surveyID: surveyId,
        }
      ).fetch();

      for (let i = 0; i < orders.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: orders[i]._id },
          { $set: { order: i + 1 } }
        );
      }

      return true;
    },
    fixSurveyQuestionMasterOrder(surveyId) {
      logger.info(surveyId);

      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      const orders = surveyQuestionsMasterCollection.find(
        {
          surveyID: surveyId,
        },
        {
          sort: {
            order: 1,
          },
        }
      ).fetch();

      for (let i = 0; i < orders.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: orders[i]._id },
          { $set: { order: i + 1 } }
        );
      }
    },
    removeSurveyCopyQuestionMaster(surveyCopyTitle) {
      const surveyQuestionsMasterCollection = adminCollectionObject('surveyQuestionsMaster');
      surveyQuestionsMasterCollection.remove({ surveyTitle: surveyCopyTitle });
    },
  }
);

/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    addSurvey(title, active, copy, surveyCopyID, stype, created) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
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
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.update(surveyID, { $set: { title, stype, active } });
    },
    updateCreatedSurvey(surveyID, created) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      surveyCollection.update(surveyID, { $set: { created } });
    },
    removeSurvey(surveyID) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
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
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
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
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      surveyQuestionsMasterCollection.update({ _id }, { $set: { content } });
    },
    updateSurveyQuestionMasterTitle(id, surveyTitle) {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      return surveyQuestionsMasterCollection.update(
        { surveyID: id },
        { $set: { surveyTitle } }, { multi: true }
      );
    },
    removeSurveyQuestionMaster(id) {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );

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

      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
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

      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
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
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      surveyQuestionsMasterCollection.remove({ surveyTitle: surveyCopyTitle });
    },
  }
);

/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    addSurvey(title, active, copy, surveyCopyID, stype, created, locked) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      const surveyID = surveyCollection.insert(
        {
          title,
          active,
          copy,
          surveyCopyID,
          stype,
          created,
          locked,
        }
      );
      return surveyID;
    },
    updateSurvey(surveyID, title, stype, active, locked) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.update(surveyID, { $set: { title, stype, active, locked } });
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
    removeSurveyQuestionMasterSection(id) {
      logger.log(id);
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      const order = surveyQuestionsMasterCollection.findOne({ _id: id });
      const nextOrders = surveyQuestionsMasterCollection.find(
        {
          surveyID: order.surveyID,
          contentType: 'section',
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
      surveyQuestionsMasterCollection.remove({ sectionID: id });
      return surveyQuestionsMasterCollection.remove({ _id: id });
    },
    removeSurveyQuestionMaster(id) {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );

      const order = surveyQuestionsMasterCollection.findOne({ _id: id });

      const nextOrders = surveyQuestionsMasterCollection.find(
        {
          surveyID: order.surveyID,
          sectionID: order.sectionID,
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
    updateQuestionSection(elementId, sectionId, order) {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      surveyQuestionsMasterCollection.update(
        { _id: elementId },
        { $set: { sectionID: sectionId, order: order } });    // eslint-disable-line
    },
    updateOrder(selector, incField) {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      surveyQuestionsMasterCollection.update(
        selector,
        { $inc: { order: incField } },
        { multi: true }
      );
    },
    fixSurveyQuestionMasterOrder(surveyId) {
      logger.info(surveyId);

      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      const sections = surveyQuestionsMasterCollection.find(
        { $and: [
          { surveyID: surveyId },
          { contentType: { $eq: 'section' } },
        ] },
        { sort: { order: 1 } }
      ).fetch();
      let sectionCount = 1;
      let questionCount;
      for (let i = 0; i < sections.length; i++) {
        surveyQuestionsMasterCollection.update(
          { _id: sections[i]._id },
          { $set: { order: sectionCount++ } }
        );
        const questions = surveyQuestionsMasterCollection.find(
          { sectionID: sections[i]._id },
          { sort: { order: 1 },
          }
        ).fetch();
        questionCount = 1;
        for (let j = 0; j < questions.length; j++) {
          surveyQuestionsMasterCollection.update(
            { _id: questions[j]._id },
            { $set: { order: questionCount++ } }
          );
        }
      }
    },
    removeSurveyCopyQuestionMaster(surveyCopyTitle) {
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      surveyQuestionsMasterCollection.remove({ surveyTitle: surveyCopyTitle });
    },
    creatingHMISSurvey(surveyTitle, surveyOwner, tagValue, locked, copySurveyId) {
      const survey = { surveyTitle, surveyOwner, tagValue, locked, copySurveyId };
      return HMISAPI.createSurvey(survey);
    },
    creatingHMISSection(surveyId, sectionText, order) {
      const sectionDetail = '';
      const sectionWeight = 0;
      const surveySection = { sectionText, sectionDetail, sectionWeight, order };
      return HMISAPI.createSection(surveySection, surveyId);
    },
    creatingQuestionMapping(surveyId, sectionId, required, questionId) {
        if (!required|| required === 'skip') {
            required = false;
        }
      const sectionQuestionMappings = { sectionQuestionMappings: [
        { question: { questionId }, required },
      ] };
      if (questionId) {
          return HMISAPI.createSurveyQuestionMappings(surveyId, sectionId, sectionQuestionMappings);
      }
      return false;
    },
    addSectionMongoApiId(_id, apiSurveyServiceId) {
      surveyQuestionsMaster.update(_id,
        { $set: { apiSurveyServiceId } });
      logger.info('Hmis Survey Section Id Added to mongo');
    },
    addSurveyApiId(_id, apiSurveyServiceId) {
      surveys.update(_id,
        { $set: { apiSurveyServiceId } });
      logger.info('Hmis Survey Id Added to mongo');
    },
    updatingHmisSurvey(surveyId, surveyTitle, surveyOwner, tagValue, locked, copySurveyId) {
      const survey = { surveyTitle, surveyOwner, tagValue, locked, copySurveyId };
      return HMISAPI.updateHmisSurvey(surveyId, survey);
    },
    updatingHmisSection(surveyId, sectionId, sectionText, order) {
      const sectionDetail = '';
      const sectionWeight = 0;
      const surveySection = { sectionText, sectionDetail, sectionWeight, order };
      return HMISAPI.updateHmisSurveySection(surveySection, surveyId, sectionId);
    },
    updateQuesIdInSqm(_id, apiSurveyServiceId) {
      surveyQuestionsMaster.update(_id, { $set: { apiSurveyServiceId } });
      logger.info('Hmis Survey Question Id Added to mongo');
    },
    getAllHmisSections(surveyId) {
      return HMISAPI.getHmisSurveySections(surveyId);
    },
    gettingQuesMapping(surveyId, sectionId) {
      return HMISAPI.getHmisSurveyQuestionMappings(surveyId, sectionId);
    },
    deleteQuesMapping(surveyId, sectionId, questionId) {
      return HMISAPI.deleteHmisSurveyQuestionMapping(surveyId, sectionId, questionId);
    },
    deleteHmisSection(surveyId, sectionId) {
      return HMISAPI.deleteHmisSurveySection(surveyId, sectionId);
    },
    deleteQuesMappings(surveyId, sectionId, questionIds) {
      return HMISAPI.deleteQuestionMappings(surveyId, sectionId, questionIds);
    },
  }
);

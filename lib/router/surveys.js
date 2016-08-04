/**
 * Created by udit on 06/02/16.
 */

Router.route(
  'selectSurveyQuestion', {
    path: '/surveys/:_id/selectQuestions',
    template: 'selectQuestions',
    controller: 'AppController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Select Questions');
      Session.set('admin_collection_name', 'selectQuestions');
      Session.set('admin_collection_page', '');
    },
    data() {
      const surveyID = this.params._id;
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.findOne({ _id: surveyID });
    },
  }
);

Router.route(
  'previewSurvey', {
    path: '/surveys/:_id/preview',
    template: 'previewSurvey',
    controller: 'AppController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Survey Preview');
      Session.set('admin_collection_name', 'preview');
      Session.set('admin_collection_page', '');
    },
    data() {
      const surveyID = this.params._id;
      return surveys.findOne({ _id: surveyID });
    },
  }
);

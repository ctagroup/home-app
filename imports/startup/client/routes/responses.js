import Responses from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import { AppController } from './controllers';
import '/imports/ui/responses/responsesListView';
import '/imports/ui/responses/responsesNew';
import '/imports/ui/responses/responsesEdit';


Router.route('adminDashboardresponsesView', {
  path: '/responses',
  template: Template.responsesListView,
  controller: AppController,
  waitOn() {
    return [
      Meteor.subscribe('responses.all'),
      Meteor.subscribe('surveys.all'),
    ];
  },
  data() {
    return {
      title: 'Responses',
      subtitle: 'View',
    };
  },
});

Router.route('adminDashboardresponsesNew', {
  path: '/responses/new',
  template: Template.responsesNew,
  controller: AppController,
  waitOn() {
    const { clientId, schema } = this.params.query;
    if (clientId) {
      return schema ? Meteor.subscribe('clients.one', clientId, schema)
        : Meteor.subscribe('pendingClients.one', clientId);
    }
    return [];
  },
  data() {
    return {
      title: 'Responses',
      subtitle: 'New',
    };
  },
});

Router.route('adminDashboardresponsesEdit', {
  path: '/responses/:_id/edit',
  template: Template.responsesEdit,
  controller: AppController,
  waitOn() {
    return [
      Meteor.subscribe('responses.one', this.params._id),
      Meteor.subscribe('surveys.all'),
    ];
  },
  data() {
    const response = Responses.findOne(this.params._id);
    return {
      title: 'Responses',
      subtitle: 'Edit',
      response,
      survey: response && Surveys.findOne(response.surveyID),
    };
  },
});

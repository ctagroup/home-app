import { Clients } from '/imports/api/clients/clients';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import Responses from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/responses/responsesListView';
import '/imports/ui/responses/responsesNew';
import '/imports/ui/responses/responsesEdit';


Router.route('adminDashboardresponsesView', {
  path: '/responses',
  template: Template.responsesListView,
  controller: AppController,
  onBeforeAction() {
    if (!Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles)) {
      Router.go('notEnoughPermission');
    }
    this.next();
  },
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
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    const { clientId, schema } = this.params.query;
    if (schema) {
      return [
        Meteor.subscribe('clients.one', clientId, schema),
        Meteor.subscribe('surveys.all'),
        Meteor.subscribe('questions.all'),
      ];
    }
    return [
      Meteor.subscribe('pendingClients.one', clientId),
      Meteor.subscribe('surveys.all'),
      Meteor.subscribe('questions.all'),
    ];
  },
  data() {
    const { clientId, surveyId } = this.params.query;
    const survey = Surveys.findOne(surveyId);
    const client = PendingClients.findOne(clientId) || Clients.findOne(clientId);

    return {
      title: 'Responses',
      subtitle: 'New',
      survey,
      client,
    };
  },
});

Router.route('adminDashboardresponsesEdit', {
  path: '/responses/:_id/edit',
  template: Template.responsesEdit,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return [
      Meteor.subscribe('responses.one', this.params._id),
      Meteor.subscribe('surveys.all'),
      Meteor.subscribe('questions.all'),
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

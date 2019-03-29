import { Clients } from '/imports/api/clients/clients';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import Responses from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import {
  ResponsesAccessRoles,
  ClientsAccessRoles,
} from '/imports/config/permissions';
import { fullName } from '/imports/api/utils';
import { AppController } from './controllers';
import '/imports/ui/responses/responsesListView';
import '/imports/ui/responses/responsesNew';
import '/imports/ui/responses/responsesEdit';
import '/imports/ui/responses/responsesArchive';
import '/imports/ui/responses/responsesImport';


Router.route('adminDashboardresponsesView', {
  path: '/responses',
  template: Template.responsesListView,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ResponsesAccessRoles);
    },
  },
  waitOn() {
    const { clientId, schema } = this.params.query;

    const subscriptions = [
      Meteor.subscribe('surveys.all', false),
      Meteor.subscribe('surveys.v1'),
    ];

    if (clientId) {
      if (schema) {
        subscriptions.push(Meteor.subscribe('clients.one', clientId, schema, false));
      } else {
        subscriptions.push(Meteor.subscribe('pendingClients.one', clientId));
      }
    }
    return subscriptions;
  },
  data() {
    const { clientId } = this.params.query;
    const client = PendingClients.findOne(clientId) || Clients.findOne(clientId);
    return {
      title: 'Responses',
      subtitle: clientId ? fullName(client) : 'View',
      client,
      clientId,
    };
  },
});

Router.route('adminDashboardresponsesNew', {
  path: '/responses/new',
  template: Template.responsesNew,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  waitOn() {
    const { clientId, schema, surveyId } = this.params.query;
    // TODO: subscribe to particular survey:
    if (schema) {
      return [
        Meteor.subscribe('clients.one', clientId, schema),
        Meteor.subscribe('surveys.one', surveyId),
        // Meteor.subscribe('questions.all'),
      ];
    }
    return [
      Meteor.subscribe('pendingClients.one', clientId),
      Meteor.subscribe('surveys.one', surveyId),
      // Meteor.subscribe('questions.all'),
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
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  waitOn() {
    return [
      Meteor.subscribe('responses.one', this.params._id),
      // Meteor.subscribe('surveys.all', this.params.surveyId),
      // Meteor.subscribe('questions.all'),
    ];
  },
  onBeforeAction() {
    // Redirect External Surveyor
    if (Roles.userIsInRole(Meteor.userId(), 'External Surveyor')) {
      const pausedResponse = Responses.findOne({
        _id: Router.current().params._id,
        status: 'paused',
      });
      if (!pausedResponse) {
        Bert.alert('This client has already been surveyed', 'danger', 'growl-top-right');
        Router.go('dashboard');
      }
    }
    const response = Responses.findOne(this.params._id) || {};
    if (response.version < 2) {
      Router.go('responsesArchive', { _id: this.params._id });
      this.next();
      return;
    }

    const { clientId, clientSchema, surveyId } = response;
    this.clientSub = Meteor.subscribe('clients.one', clientId, clientSchema);
    this.surveySub = Meteor.subscribe('surveys.one', surveyId);
    this.next();
  },
  data() {
    const ready = (this.clientSub && this.surveySub) ?
      (this.clientSub.ready() && this.surveySub.ready()) : false;

    const response = Responses.findOne(this.params._id);
    if (!response) return {};

    const { clientId, clientSchema } = response;
    const clientStub = {
      _id: clientId,
      schema: clientSchema,
    };

    return {
      title: 'Responses',
      subtitle: 'Edit',
      loading: !ready,
      response,
      survey: Surveys.findOne(response.surveyId),
      client: Clients.findOne(clientId) || clientStub,
    };
  },
});

Router.route('responsesArchive', {
  path: '/responses/:_id/archive',
  template: Template.responsesArchive,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ResponsesAccessRoles);
    },
  },
  waitOn() {
    // TODO: subscribe client details
    return [
      Meteor.subscribe('responses.one', this.params._id),
      Meteor.subscribe('surveys.v1'),
      Meteor.subscribe('questions.v1'),
    ];
  },
  data() {
    const response = Responses.findOne(this.params._id);
    if (!response) {
      return {};
    }
    const survey = Surveys.findOne(response.surveyId);
    return {
      title: 'Responses',
      subtitle: 'Archive',
      response,
      survey,
      client: {
        // TODO: get client data via subscription
        _id: response.clientId,
        schema: response.clientSchema,
      },
    };
  },
});

Router.route('adminDashboardresponsesImport', {
  path: '/responses/:_id/import',
  template: Template.responsesImport,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  waitOn() {
    this.errorMessage = new ReactiveVar('');
    this.responseSub = Meteor.subscribe('responses.one', this.params._id);
    return [
      this.responseSub,
    ];
  },
  onBeforeAction() {
    const { clientId, clientSchema, surveyId } = this.params.query;
    if (!Responses.findOne(this.params._id)) {
      Meteor.call('responses.importSubmissionFromHslynk',
        clientId, clientSchema, surveyId, this.params._id,
        (err) => {
          if (err) {
            this.errorMessage.set(`${err}`);
          } else {
            Meteor.subscribe('responses.one', this.params._id, () => {
              Router.go('adminDashboardresponsesEdit', { _id: this.params._id });
            });
          }
        }
      );
    }
    this.next();
  },
  data() {
    return {
      title: 'Responses',
      subtitle: 'Import',
      error: this.errorMessage.get(),
    };
  },
});

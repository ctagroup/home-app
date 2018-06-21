import { Clients } from '/imports/api/clients/clients';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { RecentClients } from '/imports/api/recent-clients';
import Responses from '/imports/api/responses/responses';
import FeatureDecisions from '/imports/both/featureDecisions';
import { ClientsAccessRoles } from '/imports/config/permissions';
import '/imports/ui/clients/clientNotFound';
import '/imports/ui/clients/selectSurvey';
import '/imports/ui/clients/signROI';
import '/imports/ui/clients/searchClient';
import '/imports/ui/clients/createClient';
import '/imports/ui/clients/editClient';
import '/imports/ui/clients/viewClient';
import '/imports/ui/clients/viewClientMc211';
import { AppController } from './controllers';
import { ClientConsentController } from './consentControllers';


const featureDecisions = FeatureDecisions.createFromMeteorSettings();

const clientProfileTemplate = featureDecisions.isMc211App() ?
  'viewClientMc211' : 'viewClient';

Router.route('adminDashboardclientsView', {
  path: '/clients',
  template: 'searchClient',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('pendingClients.all');
  },
  data() {
    return {
      title: 'Clients',
      subtitle: 'Search',
    };
  },
});

Router.route('adminDashboardclientsNew', {
  path: '/clients/new',
  template: 'createClient',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  data() {
    return {
      title: 'Clients',
      subtitle: 'New',
    };
  },
});

Router.route(
  '/clients/:_id', {
    name: 'viewClient',
    template: clientProfileTemplate,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
      },
    },
    onBeforeAction() {
      // Redirect External Surveyor
      const clientId = Router.current().params._id;
      if (Roles.userIsInRole(Meteor.userId(), 'External Surveyor')) {
        const pausedResponse = Responses.findOne({
          clientId,
          status: 'paused',
        });
        const hasNoResponses = Responses.find({ clientId }).count() === 0;
        const hmisClient = Clients.findOne(clientId);
        const query = hmisClient ? { schema: hmisClient.schema } : {};

        if (pausedResponse) {
          Bert.alert('Finish the response', 'success', 'growl-top-right');
          Router.go('adminDashboardresponsesEdit', { _id: pausedResponse._id });
        } else if (hasNoResponses) {
          Bert.alert('Create new response', 'success', 'growl-top-right');
          Router.go('selectSurvey', { _id: clientId }, { query });
        } else {
          if (hmisClient) {
            Bert.alert('This client has already been surveyed', 'danger', 'growl-top-right');
            Router.go('adminDashboardclientsView');
          } else {
            Bert.alert('Please upload the client', 'warning', 'growl-top-right');
          }
        }
      }
      this.next();
    },
    waitOn() {
      const id = Router.current().params._id;
      if (this.params.query.schema) {
        return [
          Meteor.subscribe('clients.one', id, this.params.query.schema),
          Meteor.subscribe('responses.all', id),
        ];
      }
      return [
        Meteor.subscribe('pendingClients.one', id),
        Meteor.subscribe('responses.all', id),
      ];
    },
    data() {
      const isExtSurveyor = Roles.userIsInRole(Meteor.userId(), 'External Surveyor');
      const pendingClient = PendingClients.findOne({ _id: this.params._id });
      const client = Clients.findOne({ _id: this.params._id });
      return {
        isPendingClient: !!pendingClient,
        client: pendingClient || client,
        showSurveyButton: !isExtSurveyor,
        showUploadButton: !client,
        showEditButton: !isExtSurveyor,
        showResponsesButton: !isExtSurveyor,
      };
    },
  }
);

Router.route('adminDashboardclientsEdit', {
  path: '/clients/:_id/edit',
  template: 'editClient',
  controller: ClientConsentController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  waitOn() {
    const id = Router.current().params._id;
    if (this.params.query && this.params.query.schema) {
      return Meteor.subscribe('clients.one', id, this.params.query.schema);
    }
    return Meteor.subscribe('pendingClients.one', id);
  },
  data() {
    const params = Router.current().params;
    const client = PendingClients.findOne(params._id) || Clients.findOne(params._id);
    return {
      title: 'Clients',
      subtitle: 'Edit',
      client,
    };
  },
});

Router.route(
  '/clients/:_id/select-survey', {
    name: 'selectSurvey',
    template: Template.selectSurvey,
    controller: ClientConsentController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
      },
    },
    waitOn() {
      const _id = Router.current().params._id;
      if (this.params.query.schema) {
        return [
          Meteor.subscribe('clients.one', _id, this.params.query.schema),
          Meteor.subscribe('surveys.all'),
        ];
      }
      return [
        Meteor.subscribe('pendingClients.one', _id),
        Meteor.subscribe('surveys.all'),
      ];
    },
    data() {
      const params = Router.current().params;
      const client = PendingClients.findOne(params._id) || Clients.findOne(params._id);
      return {
        title: 'Clients',
        subtitle: `Select Survey: ${this.params._id}`,
        client,
      };
    },
  }
);


Router.route(
  '/clients/:_id/sign-roi', {
    name: 'signROI',
    template: Template.signROI,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
      },
    },
    data() {
      return {
        title: 'Sign ROI',
        clientId: this.params._id,
        dedupClientId: this.params.query.dedupClientId,
      };
    },
  }
);

Router.onBeforeAction(
  function clientAction() {
    const routeName = this.route.getName();

    let clientId = this.params._id;

    if (routeName === 'adminDashboardresponsesNew') {
      clientId = this.params.query.clientId;
    }

    const client = PendingClients.findOne(clientId) || Clients.findOne(clientId);

    const viewClientRoute = Router.routes.viewClient;
    if (!client) {
      this.render('clientNotFound');
    } else {
      if (this.params.query && this.params.query.schema) {
        client.personalId = client.clientId;
        client.isHMISClient = true;
        client.schema = this.params.query.schema;
        client.url = viewClientRoute.path(
          { _id: client.clientId },
          { query: `schema=${this.params.query.schema}` }
        );
      } else {
        client.url = viewClientRoute.path({ _id: client._id });
      }
      RecentClients.upsert(client);
      this.next();
    }
  }, {
    only: ['viewClient', 'selectSurvey', 'adminDashboardresponsesNew'],
  }
);

import { Clients } from '/imports/api/clients/clients';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { RecentClients } from '/imports/api/recent-clients';
import { AppController } from './controllers';
import '/imports/ui/clients/clientNotFound';
import '/imports/ui/clients/selectSurvey';


Router.route('adminDashboardclientsView', {
  path: '/clients',
  template: 'searchClient',
  controller: AppController,
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
    template: 'viewClient',
    controller: AppController,
    waitOn() {
      const id = Router.current().params._id;
      if (this.params.query.schema) {
        return [
          Meteor.subscribe('client', id, this.params.query.schema),
          Meteor.subscribe('responses.all', id),
        ];
      }
      return [
        Meteor.subscribe('pendingClients.one', id),
        Meteor.subscribe('responses.all', id),
      ];
    },

    onBeforeAction() {
      const collection = HomeConfig.collections.clients;

      if (collection.userRoles) {
        if (!Roles.userIsInRole(Meteor.userId(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }

      // External Surveyor redirects
      const clientID = Router.current().params._id;
      if (Roles.userIsInRole(Meteor.userId(), 'External Surveyor')) {
        const pausedResponse = responses.findOne({
          clientID,
          responsestatus: 'Paused',
        });
        const hasNoResponses = responses.find({ clientID }).count() === 0;
        const hmisClient = Clients.findOne(clientID);
        const query = hmisClient ? { schema: hmisClient.schema } : {};

        if (pausedResponse) {
          Bert.alert('Finish the response', 'success', 'growl-top-right');
          Router.go('adminDashboardresponsesEdit', { _id: pausedResponse._id });
        } else if (hasNoResponses) {
          Bert.alert('Create new response', 'success', 'growl-top-right');
          Router.go('selectSurvey', { _id: clientID }, { query });
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
  controller: AppController,
  waitOn() {
    const id = Router.current().params._id;
    if (this.params.query && this.params.query.schema) {
      return Meteor.subscribe('client', id, this.params.query.schema);
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
    controller: AppController,
    waitOn() {
      const _id = Router.current().params._id;
      if (this.params.query.schema) {
        return [
          Meteor.subscribe('client', _id, this.params.query.schema),
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

/**
 * Created by udit on 01/08/16.
 */

Router.onBeforeAction(
  function clientAction() {
    let recentClients = Session.get('recentClients') || [];
    const that = this;

    const routeName = this.route.getName();

    let clientID = this.params._id;

    if (routeName === 'adminDashboardresponsesNew') {
      clientID = this.params.query.client_id;
    }

    const client = clients.findOne({ _id: clientID });
    const viewClientRoute = Router.routes.viewClient;
    if (!client) {
      that.render('clientNotFound');
    } else if (this.params.query && this.params.query.isHMISClient && this.params.query.schema) {
      client.personalId = client.clientId;
      client.isHMISClient = true;
      client.schema = this.params.query.schema;
      client.url = viewClientRoute.path(
        { _id: client.clientId },
        { query: `isHMISClient=true&schema=${this.params.query.schema}` }
      );
    } else {
      client.url = viewClientRoute.path({ _id: client._id });
    }

    const recentClientsIDs = recentClients.map((client) => client._id);

    if (recentClientsIDs.indexOf(clientID) === - 1) {
      const data = {
        _id: client._id,
        name: `${client.firstName.trim()} ${client.lastName.trim()}`,
        url: client.url,
      };
      recentClients.push(data);
      recentClients = $.unique(recentClients);
      Session.set('recentClients', recentClients);
    }

    this.next();
  }, {
    only: ['viewClient', 'selectSurvey', 'adminDashboardresponsesNew'],
  }
);

Router.route(
  '/clients/:_id', {
    name: 'viewClient',
    template: 'viewClient',
    controller: 'AppController',
    waitOn() {
      if (this.params.query && this.params.query.isHMISClient && this.params.query.schema) {
        const _id = Router.current().params._id;
        return Meteor.subscribe('singleHMISClient', _id, this.params.query.schema);
      } else {
        const _id = Router.current().params._id;
        return Meteor.subscribe('singleLocalClient', _id);
      }
    },
    onBeforeAction() {
      const collection = HomeConfig.collections.clients;
      if (collection.userRoles) {
        if (! Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', HomeDashboard.collectionLabel('clients'));
      Session.set('admin_subtitle', `View: ${this.params._id}`);
      Session.set('admin_collection_name', 'clients');
      Session.set('admin_id', HomeUtils.parseID(this.params._id));
    },
    data() {
      return clients.findOne({ _id: this.params._id });
    },
  }
);

Router.route(
  '/clients/:_id/select-survey', {
    name: 'selectSurvey',
    template: 'selectSurvey',
    controller: 'AppController',
    waitOn() {
      if (this.params.query && this.params.query.isHMISClient && this.params.query.schema) {
        const _id = Router.current().params._id;
        return Meteor.subscribe('singleHMISClient', _id, this.params.query.schema);
      } else {
        const _id = Router.current().params._id;
        return Meteor.subscribe('singleLocalClient', _id);
      }
    },
    onBeforeAction() {
      const collection = HomeConfig.collections.clients;
      if (collection.userRoles) {
        if (! Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', HomeDashboard.collectionLabel('clients'));
      Session.set('admin_subtitle', `Select Survey: ${this.params._id}`);
      Session.set('admin_collection_name', 'clients');
      Session.set('admin_id', HomeUtils.parseID(this.params._id));
    },
  }
);

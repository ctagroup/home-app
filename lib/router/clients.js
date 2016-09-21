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
    } else if (routeName === 'adminDashboardresponsesEdit') {
      clientID = '';
    }

    if (this.params.query && this.params.query.isHMISClient && this.params.query.schema) {
      Meteor.call(
        'getHMISClient', clientID, this.params.query.schema, (err, res) => {
          const rez = res;
          if (err) {
            logger.log(err);
            that.render('clientNotFound');
            return;
          }

          if (rez) {
            rez.personalId = rez.clientId;
            rez._id = rez.clientId;
            rez.isHMISClient = true;
            rez.schema = this.params.query.schema;
            Session.set('currentHMISClient', rez);

            const recentClientsIDs = recentClients.map((client) => client._id);

            if (recentClientsIDs.indexOf(clientID) === - 1) {
              const route = Router.routes.viewClient;
              const data = {
                _id: that.params._id,
                name: `${rez.firstName.trim()} ${rez.lastName.trim()}`,
                url: route.path(
                  { _id: that.params._id },
                  { query: `isHMISClient=true&schema=${this.params.query.schema}` }
                ),
              };
              recentClients.push(data);
              recentClients = $.unique(recentClients);
              Session.set('recentClients', recentClients);
            }
          } else {
            that.render('clientNotFound');
          }
        }
      );
    } else {
      const client = clients.findOne({ _id: clientID });

      if (client && client._id) {
        const recentClientsIDs = recentClients.map((clientz) => clientz._id);

        if (recentClientsIDs.indexOf(clientID) === - 1) {
          const route = Router.routes.viewClient;
          const data = {
            _id: clientID,
            name: `${client.firstName.trim()} ${client.lastName.trim()}`,
            url: route.path({ _id: clientID }),
          };
          recentClients.push(data);
          recentClients = $.unique(recentClients);
          Session.set('recentClients', recentClients);
        }
      } else {
        this.render('clientNotFound');
        return;
      }
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
      const doc = HomeUtils.adminCollectionObject('clients').findOne({
        _id: HomeUtils.parseID(this.params._id),
      });

      Session.set('admin_title', HomeDashboard.collectionLabel('clients'));
      Session.set('admin_subtitle', `View: ${this.params._id}`);
      Session.set('admin_collection_name', 'clients');
      Session.set('admin_id', HomeUtils.parseID(this.params._id));
      Session.set('admin_doc', doc);
    },
    data() {
      let client = '';
      if (this.params.query && this.params.query.isHMISClient) {
        client = Session.get('currentHMISClient') || false;
      } else {
        const clientID = this.params._id;
        client = clients.findOne({ _id: clientID });
      }
      return client;
    },
  }
);

Router.route(
  '/clients/:_id/select-survey', {
    name: 'selectSurvey',
    template: 'selectSurvey',
    controller: 'AppController',
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
      const doc = HomeUtils.adminCollectionObject('clients').findOne({
        _id: HomeUtils.parseID(this.params._id),
      });

      Session.set('admin_title', HomeDashboard.collectionLabel('clients'));
      Session.set('admin_subtitle', `Select Survey: ${this.params._id}`);
      Session.set('admin_collection_name', 'clients');
      Session.set('admin_id', HomeUtils.parseID(this.params._id));
      Session.set('admin_doc', doc);
    },
  }
);

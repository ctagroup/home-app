/**
 * Created by udit on 01/08/16.
 */

Router.onBeforeAction(
  function clientAction() {
    let recentClients = Session.get('recentClients') || [];
    const that = this;

    const route = this.route.getName();

    let client_id = this.params._id;

    if ( route === 'adminDashboardresponsesNew' ) {
      client_id = this.params.query.client_id;
    }

    if (this.params.query && this.params.query.isHMISClient && this.params.query.link) {
      Meteor.call(
        'getHMISClient', client_id, this.params.query.link, (err, res) => {
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
            Session.set('currentHMISClient', rez);

            const recentClientsIDs = recentClients.map((client) => client._id);

            if (recentClientsIDs.indexOf(client_id) === - 1) {
              const route = Router.routes.viewClient;
              const data = {
                _id: that.params._id,
                name: `${rez.firstName.trim()} ${rez.lastName.trim()}`,
                url: route.path(
                  { _id: that.params._id },
                  { query: `isHMISClient=true&link=${encodeURIComponent(this.params.query.link)}` }
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
      const client = clients.findOne({ _id: client_id });

      if (client && client._id) {
        const recentClientsIDs = recentClients.map((clientz) => clientz._id);

        if (recentClientsIDs.indexOf(client_id) === - 1) {
          const route = Router.routes.viewClient;
          const data = {
            _id: client_id,
            name: `${client.firstName.trim()} ${client.lastName.trim()}`,
            url: route.path({ _id: client_id }),
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

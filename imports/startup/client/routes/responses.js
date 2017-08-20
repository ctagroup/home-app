import { Clients } from '/imports/api/clients/clients';
import { AppController } from './controllers';
import '/imports/ui/responses/responsesListView';
import '/imports/ui/responses/responsesNew';


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
  template: 'AdminDashboardEdit',
  controller: AppController,
  action() {
    this.render();
  },
  waitOn() {
    return [];
  },
  onBeforeAction() {

  },
  onAfterAction() {

  },
  data() {
    return {
      admin_collection: Clients,
    };
  },
});

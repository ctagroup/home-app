import { ReactiveVar } from 'meteor/reactive-var';
import CollectionsCount from '/imports/api/collectionsCount/collectionsCount';
import {
  DefaultAdminAccessRoles,
  // GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  ClientsAccessRoles,
  ResponsesAccessRoles,
 // PendingClientsAccessRoles,
} from '/imports/config/permissions';
import './widget.html';
import './dashboardMonterey.html';


const allWidgets = [
 /* {
    name: 'Pending Clients',
    id: 'clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
  },*/
  {
    name: 'Clients',
    id: 'clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: ClientsAccessRoles,
  },
  {
    name: 'Active List',
    id: 'eligibleClients',
    icon: 'fa-user-plus',
    path: 'adminDashboardeligibleClientsView',
    roles: DefaultAdminAccessRoles,
  },
  // {
  //   name: 'Match',
  //   id: 'housingMatch',
  //   icon: 'fa-bed',
  //   path: 'adminDashboardhousingMatchView',
  //   roles: DefaultAdminAccessRoles,
  // },
  {
    name: 'Questions',
    id: 'questions',
    icon: 'fa-question',
    path: 'questionsView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Surveys',
    id: 'surveys',
    icon: 'fa-file-text',
    path: 'adminDashboardsurveysView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Responses',
    id: 'responses',
    icon: 'fa-comment-o',
    path: 'adminDashboardresponsesView',
    roles: ResponsesAccessRoles,
  },
  {
    name: 'Surveyed Clients',
    id: 'surveyed',
    icon: 'fa-user',
    path: 'clientsSurveyed',
    roles: ClientsAccessRoles,
  },
  {
    name: 'Inventory',
    id: 'housingUnits',
    icon: 'fa-home',
    path: 'adminDashboardhousingUnitsView',
    roles: HousingUnitsAccessRoles,
  },
  // {
  //   name: 'Households',
  //   id: 'globalHouseholds',
  //   icon: 'fa-users',
  //   path: 'adminDashboardglobalHouseholdsView',
  //   roles: GlobalHouseholdsAccessRoles,
  // },
  {
    name: 'Users',
    id: 'users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
  },
];

Template.dashboardMonterey.onCreated(function onDashboardCreated() {
  this.surveyedCount = new ReactiveVar(false);
});
Template.dashboardMonterey.onRendered(function onDashboardRendered() {
  Meteor.call('responses.count', (err, res) => {
    if (!err) this.surveyedCount.set(res.length);
  });
});

Template.dashboardMonterey.helpers({
  widgets() {
    const allowedWidgets = _.filter(allWidgets,
      widget => Roles.userIsInRole(Meteor.user(), widget.roles)
    );
    return allowedWidgets.map((widget) => {
      if (widget.id === 'surveyed') {
        const count = Template.instance().surveyedCount.get();

        return _.extend(widget, {
          icon: widget.icon || 'fa-file-text',
          color: widget.color || 'primary',
          count: count || 0,
          loading: count === false,
        });
      }
      const doc = CollectionsCount.findOne(widget.id) || { count: 0 };
      return _.extend(widget, {
        icon: widget.icon || 'fa-file-text',
        color: widget.color || 'primary',
        count: doc.count,
        loading: doc.loading,
      });
    });
  },
});

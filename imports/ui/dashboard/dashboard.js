import CollectionsCount from '/imports/api/collectionsCount/collectionsCount';
import {
  DefaultAdminAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions';
import './dashboard.html';


const allWidgets = [
  {
    name: 'Pending Clients',
    id: 'clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
  },
  {
    name: 'Active List',
    id: 'eligibleClients',
    icon: 'fa-user-plus',
    path: 'adminDashboardeligibleClientsView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Housing Match',
    id: 'housingMatch',
    icon: 'fa-bed',
    path: 'adminDashboardhousingMatchView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Questions',
    id: 'questions',
    icon: 'fa-question',
    path: 'adminDashboardquestionsView',
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
    name: 'Housing Units',
    id: 'housingUnits',
    icon: 'fa-home',
    path: 'adminDashboardhousingUnitsView',
    roles: HousingUnitsAccessRoles,
  },
  {
    name: 'Households',
    id: 'globalHouseholds',
    icon: 'fa-users',
    path: 'adminDashboardglobalHouseholdsView',
    roles: GlobalHouseholdsAccessRoles,
  },
  {
    name: 'Users',
    id: 'users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
  },
];

Template.dashboard.helpers({
  widgets() {
    const allowedWidgets = _.filter(allWidgets,
      widget => Roles.userIsInRole(Meteor.user(), widget.roles)
    );
    return allowedWidgets.map((widget) => {
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

import CollectionsCount from '/imports/api/collectionsCount/collectionsCount';
import {
  DefaultAdminAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions';
import './widget.html';
import './dashboardHome.html';

import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import FeatureDecisions from '/imports/both/featureDecisions';
const featureDecisions = FeatureDecisions.createFromMeteorSettings();

const allWidgets = [
  {
    name: 'Pending Clients',
    id: 'clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
    permissions: 'accessPendingClients',
  },
  {
    name: 'Active List',
    id: 'eligibleClients',
    icon: 'fa-user-plus',
    path: 'adminDashboardeligibleClientsView',
    roles: DefaultAdminAccessRoles,
    permissions: 'viewEligibleClients',
  },
  {
    name: 'Housing Match',
    id: 'housingMatch',
    icon: 'fa-bed',
    path: 'adminDashboardhousingMatchView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessHouseMatch',
  },
  {
    name: 'Questions',
    id: 'questions',
    icon: 'fa-question',
    path: 'questionsView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessQuestions',
  },
  {
    name: 'Surveys',
    id: 'surveys',
    icon: 'fa-file-text',
    path: 'adminDashboardsurveysView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessSurveys',
  },
  {
    name: 'Responses',
    id: 'responses',
    icon: 'fa-comment-o',
    path: 'adminDashboardresponsesView',
    roles: ResponsesAccessRoles,
    permissions: 'accessResponses',
  },
  {
    name: 'Housing Units',
    id: 'housingUnits',
    icon: 'fa-home',
    path: 'adminDashboardhousingUnitsView',
    roles: HousingUnitsAccessRoles,
    permissions: 'accessHousingUnits',
  },
  {
    name: 'Households',
    id: 'globalHouseholds',
    icon: 'fa-users',
    path: 'adminDashboardglobalHouseholdsView',
    roles: GlobalHouseholdsAccessRoles,
    permissions: 'accessHouseholds',
  },
  {
    name: 'Users',
    id: 'users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessUsers',
  },
];

Template.dashboardHome.helpers({
  widgets() {
    let mapper;
    const user = Meteor.user();
    if (featureDecisions.roleManagerEnabled()) {
      mapper = (item) => ableToAccess(user, item.permissions);
    } else {
      mapper = (item) => Roles.userIsInRole(user, item.roles);
    }
    const allowedWidgets = _.filter(allWidgets, mapper);
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

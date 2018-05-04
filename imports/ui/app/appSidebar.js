import {
  DefaultAdminAccessRoles,
  FilesAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions';
import FeatureDecisions from '/imports/both/featureDecisions';
import './appSidebar.html';

import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';

const homeMenuItems = [
  {
    name: 'Pending Clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
    permissions: 'accessPendingClients',
  },
  {
    name: 'Active List',
    icon: 'fa-user-plus',
    path: 'adminDashboardeligibleClientsView',
    roles: DefaultAdminAccessRoles,
    permissions: 'viewEligibleClients',
  },
  {
    name: 'Housing Match',
    icon: 'fa-bed',
    path: 'adminDashboardhousingMatchView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessHouseMatch',
  },
  {
    name: 'Questions',
    icon: 'fa-question',
    path: 'questionsView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessQuestions',
  },
  {
    name: 'Surveys',
    icon: 'fa-file-text',
    path: 'adminDashboardsurveysView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessSurveys',
  },
  {
    name: 'Responses',
    icon: 'fa-comment-o',
    path: 'adminDashboardresponsesView',
    roles: ResponsesAccessRoles,
    permissions: 'accessResponses',
  },
  {
    name: 'Housing Units',
    icon: 'fa-home',
    path: 'adminDashboardhousingUnitsView',
    roles: HousingUnitsAccessRoles,
    permissions: 'accessHousingUnits',
  },
  {
    name: 'Households',
    icon: 'fa-users',
    path: 'adminDashboardglobalHouseholdsView',
    roles: GlobalHouseholdsAccessRoles,
    permissions: 'accessHouseholds',
  },
  {
    name: 'Users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessUsers',
  },
];

const mc211MenuItems = [
  {
    name: 'Clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
    permissions: 'accessPendingClients',
  },
  {
    name: 'Responses',
    icon: 'fa-comment-o',
    path: 'adminDashboardresponsesView',
    roles: ResponsesAccessRoles,
    permissions: 'accessResponses',
  },
  {
    name: 'Files',
    icon: 'fa-files-o',
    path: 'filesList',
    roles: FilesAccessRoles,
    permissions: 'accessFiles',
  },
  {
    name: 'Users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessUsers',
  },
  {
    name: 'Questions',
    icon: 'fa-question',
    path: 'questionsView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessQuestions',
  },
  {
    name: 'Surveys',
    icon: 'fa-file-text',
    path: 'adminDashboardsurveysView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessSurveys',
  },
];

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
const collectionsMenuItems = featureDecisions.isMc211App() ?
  mc211MenuItems : homeMenuItems;

const adminMenuItems = [
  {
    name: 'Opening Script',
    icon: 'fa-comment',
    path: 'openingScript',
  },
  {
    name: 'Agencies',
    icon: 'fa-cog',
    path: 'agenciesList',
  },
  {
    name: 'Projects',
    icon: 'fa-cog',
    path: 'projectsList',
  },
  featureDecisions.isMc211App() ? {
    name: 'Reporting',
    icon: 'fa-envelope',
    path: 'reporting',
  } : null,
  featureDecisions.roleManagerEnabled() ? {
    name: 'Role Manager',
    icon: 'fa-cog',
    path: 'roleManager',
  } : null,
].filter(item => !!item);


Template.AppSidebar.helpers({
  collectionsMenuItems() {
    let mapper;
    const user = Meteor.user();
    if (featureDecisions.roleManagerEnabled()) {
      mapper = (item) => ableToAccess(user, item.permissions);
    } else {
      mapper = (item) => Roles.userIsInRole(user, item.roles);
    }
    const allowedMenuItems = _.filter(collectionsMenuItems, mapper);
    return allowedMenuItems;
  },
  adminMenuItems() {
    return Roles.userIsInRole(Meteor.user(), DefaultAdminAccessRoles) ? adminMenuItems : [];
  },
});

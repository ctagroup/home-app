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


const homeMenuItems = [
  {
    name: 'Pending Clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
  },
  {
    name: 'Active List',
    icon: 'fa-user-plus',
    path: 'adminDashboardeligibleClientsView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Housing Match',
    icon: 'fa-bed',
    path: 'adminDashboardhousingMatchView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Questions',
    icon: 'fa-question',
    path: 'questionsView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Surveys',
    icon: 'fa-file-text',
    path: 'adminDashboardsurveysView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Responses',
    icon: 'fa-comment-o',
    path: 'adminDashboardresponsesView',
    roles: ResponsesAccessRoles,
  },
  {
    name: 'Housing Units',
    icon: 'fa-home',
    path: 'adminDashboardhousingUnitsView',
    roles: HousingUnitsAccessRoles,
  },
  {
    name: 'Households',
    icon: 'fa-users',
    path: 'adminDashboardglobalHouseholdsView',
    roles: GlobalHouseholdsAccessRoles,
  },
  {
    name: 'Users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
  },
];

const mc211MenuItems = [
  {
    name: 'Clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: PendingClientsAccessRoles,
  },
  {
    name: 'Responses',
    icon: 'fa-comment-o',
    path: 'adminDashboardresponsesView',
    roles: ResponsesAccessRoles,
  },
  {
    name: 'Files',
    icon: 'fa-files-o',
    path: 'filesList',
    roles: FilesAccessRoles,
  },
  {
    name: 'Users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Questions',
    icon: 'fa-question',
    path: 'questionsView',
    roles: DefaultAdminAccessRoles,
  },
  {
    name: 'Surveys',
    icon: 'fa-file-text',
    path: 'adminDashboardsurveysView',
    roles: DefaultAdminAccessRoles,
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
].filter(item => !!item);


Template.AppSidebar.helpers({
  collectionsMenuItems() {
    const allowedMenuItems = _.filter(collectionsMenuItems,
      item => Roles.userIsInRole(Meteor.user(), item.roles)
    );
    return allowedMenuItems;
  },
  adminMenuItems() {
    return Roles.userIsInRole(Meteor.user(), DefaultAdminAccessRoles) ? adminMenuItems : [];
  },
});

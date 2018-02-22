import {
  DefaultAdminAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
  FilesAccessRoles,
} from '/imports/config/permissions';
import './appSidebar.html';

const allCollectionsMenuItems = [
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

const adminMenuItems = [
  /*
  {
    name: 'Role Manager',
    icon: 'fa-user-secret',
    path: 'roleManager',
  },
  */
  {
    name: 'Opening Script',
    icon: 'fa-comment',
    path: 'openingScript',
  },
  {
    name: 'Project Setup',
    icon: 'fa-cog',
    path: 'projectSetup',
  },
  {
    name: 'Reporting',
    icon: 'fa-envelope',
    path: 'reporting',
  },
];


Template.AppSidebar.helpers({
  collectionsMenuItems() {
    const allowedMenuItems = _.filter(allCollectionsMenuItems,
      item => Roles.userIsInRole(Meteor.user(), item.roles)
    );
    return allowedMenuItems;
  },
  adminMenuItems() {
    return Roles.userIsInRole(Meteor.user(), DefaultAdminAccessRoles) ? adminMenuItems : [];
  },
});

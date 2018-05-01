import CollectionsCount from '/imports/api/collectionsCount/collectionsCount';
import {
  DefaultAdminAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions';
import './dashboardMc211.html';

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
    name: 'Users',
    id: 'users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
    permissions: 'accessUsers',
  },
];

Template.dashboardMc211.helpers({
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

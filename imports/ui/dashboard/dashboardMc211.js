import CollectionsCount from '/imports/api/collectionsCount/collectionsCount';
import {
  ClientsAccessRoles,
  DefaultAdminAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions';
import './dashboardMc211.html';


const allWidgets = [
  {
    name: 'Clients',
    id: 'clients',
    icon: 'fa-user',
    path: 'adminDashboardclientsView',
    roles: ClientsAccessRoles,
  },
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
    name: 'Users',
    id: 'users',
    icon: 'fa-user-md',
    path: 'adminDashboardusersView',
    roles: DefaultAdminAccessRoles,
  },
];

Template.dashboardMc211.helpers({
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

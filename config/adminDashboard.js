/**
 * Created by udit on 27/07/16.
 */

AdminDashboard = {
  schemas: {},
  sidebarItems: [],
  collectionItems: [],
  alertSuccess(message) {
    Session.set('adminSuccess', message);
  },
  alertFailure(message) {
    Session.set('adminError', message);
  },
  canViewAdmin() {
    if (!Roles.userIsInRole(Meteor.userId(), ['view_admin'])) {
      Meteor.call('adminCheckAdmin');
      if (AdminConfig && AdminConfig.nonAdminRedirectRoute) {
        Router.go(AdminConfig.nonAdminRedirectRoute);
      }
    }
    if (typeof this.next === 'function') {
      this.next();
    }
  },
  adminRoutes: [
    'adminDashboard',
    'adminDashboardUsersNew',
    'adminDashboardUsersEdit',
    'adminDashboardView',
    'adminDashboardNew',
    'adminDashboardEdit',
  ],
  collectionLabel(collection) {
    if (collection && AdminConfig && AdminConfig.collections
        && AdminConfig.collections[collection] && AdminConfig.collections[collection].label) {
      return AdminConfig.collections[collection].label;
    }
    return Session.get('admin_title');
  },
  addSidebarItem(title, url, options) {
    const item = { title };
    if (_.isObject(url) && typeof options === 'undefined') {
      item.options = url;
    } else {
      item.url = url;
      item.options = options;
    }
    return AdminDashboard.sidebarItems.push(item);
  },
};

AdminDashboard.schemas.sendResetPasswordEmail = new SimpleSchema({
  _id: { type: String },
});

AdminDashboard.schemas.changePassword = new SimpleSchema({
  _id: { type: String },
  password: { type: String },
});

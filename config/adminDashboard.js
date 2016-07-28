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
  collectionLabel(collection) {
    if (collection && HomeConfig && HomeConfig.collections
        && HomeConfig.collections[collection] && HomeConfig.collections[collection].label) {
      return HomeConfig.collections[collection].label;
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

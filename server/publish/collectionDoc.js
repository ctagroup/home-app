/**
 * Created by udit on 26/07/16.
 */

Meteor.publishComposite('adminCollectionDoc', (collection, id) => {
  check(collection, String);

  if (Roles.userIsInRole(this.userId, ['view_admin'])) {
    let children = [];

    if (AdminConfig && AdminConfig.collections && AdminConfig.collections[collection]
      && AdminConfig.collections[collection].children) {
      children = AdminConfig.collections[collection].children;
    }

    return {
      find() {
        return adminCollectionObject(collection).find(id);
      },
      children,
    };
  }

  return this.ready();
});

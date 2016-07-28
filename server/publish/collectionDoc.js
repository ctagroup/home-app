/**
 * Created by udit on 26/07/16.
 */

Meteor.publishComposite('collectionDoc', (collection, id) => {
  check(collection, String);

  let children = [];

  if (AdminConfig && AdminConfig.collections && AdminConfig.collections[collection]
    && AdminConfig.collections[collection].children) {
    children = AdminConfig.collections[collection].children;
  }

  return {
    find() {
      return HomeUtils.adminCollectionObject(collection).find(id);
    },
    children,
  };
});

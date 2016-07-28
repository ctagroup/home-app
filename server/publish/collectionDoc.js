/**
 * Created by udit on 26/07/16.
 */

Meteor.publishComposite('collectionDoc', (collection, id) => {
  check(collection, String);

  let children = [];

  if (HomeConfig && HomeConfig.collections && HomeConfig.collections[collection]
      && HomeConfig.collections[collection].children) {
    children = HomeConfig.collections[collection].children;
  }

  return {
    find() {
      return HomeUtils.adminCollectionObject(collection).find(id);
    },
    children,
  };
});

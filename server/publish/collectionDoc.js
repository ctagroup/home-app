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

adminPublishTables = (collections) => {
  _.each(collections, (collection, name) => {
    if (!collection.children) {
      return;
    }

    Meteor.publishComposite(
      HomeUtils.adminTablePubName(name),
      function publishCompositeMethod(tableName, ids, fields) {
        check(tableName, String);
        check(ids, Array);
        const extraFields = _.reduce(collection.extraFields, (efields, efname) => {
          const efieldz = efields;
          efieldz[efname] = 1;
          return efieldz;
        }, {});
        _.extend(fields, extraFields);
        this.unblock();
        return {
          find() {
            this.unblock();
            return HomeUtils.adminCollectionObject(name).find({ _id: { $in: ids } }, { fields });
          },
          children: collection.children,
        };
      }
    );
  });
};

adminPublishTables(HomeConfig.collections);

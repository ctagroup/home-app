/**
 * Created by udit on 26/07/16.
 */

Meteor.publish(
  'collectionsCount', function publishCollectionCount() {
    const handles = [];
    const self = this;
    _.each(
      AdminTables, (table, name) => {
        if (HomeConfig.collections[name].fetchCountFromHmis) {
          HomeConfig.collections[name].fetchCountFromHmis(self, name);
        } else {
          let count;
          let ready;
          const id = new Mongo.ObjectID();
          count = 0;
          ready = false;
          handles.push(
            table.collection.find().observeChanges(
              {
                added() {
                  count += 1;
                  return ready && self.changed('collectionsCount', id, { count });
                },
                removed() {
                  count -= 1;
                  return ready && self.changed('collectionsCount', id, { count });
                },
              }
            )
          );
          ready = true;
          self.added('collectionsCount', id, { collection: name, count });
        }
      }
    );
    self.onStop(
      () => _.each(handles, handle => handle.stop())
    );
    self.ready();
  }
);

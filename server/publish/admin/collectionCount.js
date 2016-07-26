/**
 * Created by udit on 26/07/16.
 */

Meteor.publish('adminCollectionsCount', () => {
  var handles, self;
  handles = [];
  self = this;
  _.each(AdminTables, (table, name) => {
    var count, id, ready;
    id = new Mongo.ObjectID;
    count = 0;
    ready = false;
    handles.push(table.collection.find().observeChanges({
      added() {
        count += 1;
        return ready && self.changed('adminCollectionsCount', id, {
            count: count
          });
      },
      removed() {
        count -= 1;
        return ready && self.changed('adminCollectionsCount', id, {
            count: count
          });
      }
    }));
    ready = true;
    return self.added('adminCollectionsCount', id, {
      collection: name,
      count: count
    });
  });
  self.onStop(() => {
    return _.each(handles, (handle) => {
      return handle.stop();
    });
  });
  return self.ready();
});

/**
 * Created by udit on 26/07/16.
 */
HomeUtils = {
  lookup(obj, root, required) {
    let requiredz = required;
    if (requiredz == null) {
      requiredz = true;
    }

    let rootz = root;
    if (typeof rootz === 'undefined') {
      rootz = Meteor.isServer ? global : window;
    }
    if (typeof obj === 'string') {
      let ref = rootz;
      const arr = obj.split('.');
      while (arr.length && ref[arr[0]]) {
        ref = ref[arr.shift()];
        continue;
      }
      if (!ref && requiredz) {
        throw new Error(`${obj} is not in the ${rootz.toString()}`);
      } else {
        return ref;
      }
    }
    return obj;
  },
  adminCollectionObject(collection) {
    if (AdminConfig && AdminConfig.collections && AdminConfig.collections[collection]
        && AdminConfig.collections[collection].collectionObject) {
      return AdminConfig.collections[collection].collectionObject;
    }
    return HomeUtils.lookup(collection);
  },
  adminCallback(name, args, callback) {
    let stop = false;

    if (AdminConfig && AdminConfig.callbacks && AdminConfig.callbacks[name]
        && typeof AdminConfig.callbacks[name] === 'function') {
      stop = AdminConfig.callbacks[name].apply(AdminConfig.callbacks, args) === false;
    }

    if (typeof callback === 'function') {
      if (!stop) {
        callback.apply(null, args);
      }
    }
  },
  parseID(id) {
    if (typeof id === 'string') {
      if (id.indexOf('ObjectID') > -1) {
        return new Mongo.ObjectID(id.slice(id.indexOf('"') + 1, id.lastIndexOf('"')));
      }
    }
    return id;
  },
  parseIDs(ids) {
    return _.map(ids, (id) => HomeUtils.parseID(id));
  },
};

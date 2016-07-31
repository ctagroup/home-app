/**
 * Created by udit on 08/07/16.
 */

// Tracker.autorun(() => {
  // if (Meteor.user()) {
    // const position = Geolocation.currentLocation();

    // if (position) {
      // const coords = {
      //   accuracy: position.coords.accuracy,
      //   lat: position.coords.latitude,
      //   long: position.coords.longitude,
      // };
      // Meteor.call(
      //   'addUserLocation',
      //   Meteor.user()._id,
      //   new Date(position.timestamp),
      //   coords,
      //   (error, result) => {
      //     if (error) {
      //       logger.log(error);
      //     } else {
      //       logger.log(result);
      //     }
      //   }
      // );
    // } else {
      // logger.log('position not found.');
      // logger.log(Geolocation.error());
    // }
  // }
// });

UI.registerHelper(
  'currentUserCan', (cap) => Roles.userIsInRole(Meteor.user(), cap)
);

Template.registerHelper(
  'formatDate', (date) => moment(date).format('MM/DD/YYYY')
);

Template.registerHelper(
  'my_console_log', (data) => {
    logger.log(data);
  }
);

UI.registerHelper('isiOS', () => is.ios());
UI.registerHelper('isAndroid', () => is.android());
UI.registerHelper('isCordova', () => Meteor.isCordova);

UI.registerHelper('currentUserGravatar', () => HomeHelpers.getCurrentUserGravatar());

UI.registerHelper('currentUserFullName', () => HomeHelpers.getCurrentUserFullName());

Template.AppEditBtn.helpers(
  {
    path() {
      const data = Template.instance().data;
      return Router.path(`adminDashboard${Session.get('admin_collection_name')}Edit`, {
        _id: data._id,
      });
    },
  }
);

UI.registerHelper(
  'newPath',
  () => Router.path(`adminDashboard${Session.get('admin_collection_name')}New`)
);

UI.registerHelper('hasDocuments', () => {
  let flag = false;

  const count = collectionsCount.findOne({
    collection: Session.get('admin_collection_name'),
  });

  if (count && count.count && count.count > 0) {
    flag = true;
  }

  return flag;
});

UI.registerHelper('AdminTables', AdminTables);

adminCollections = () => {
  let collections = {};

  if (HomeConfig && HomeConfig.collections) {
    collections = HomeConfig.collections;
  }

  return _.map(collections, (obj, key) => {
    let obz = _.extend(obj, { name: key });
    obz = _.defaults(obz, {
      label: key,
      icon: 'plus',
      color: 'primary',
    });

    return _.extend(obz, {
      viewPath: Router.path(`adminDashboard${key}View`),
      newPath: Router.path(`adminDashboard${key}New`),
    });
  });
};

UI.registerHelper('HomeConfig', () => HomeConfig);

UI.registerHelper(
  'admin_skin',
  () => ((HomeConfig && HomeConfig.skin) ? HomeConfig.skin : 'blue')
);

UI.registerHelper('admin_collections', adminCollections);

UI.registerHelper('admin_collection_name', () => Session.get('admin_collection_name'));

UI.registerHelper('admin_current_id', () => Session.get('admin_id'));

UI.registerHelper('admin_current_doc', () => Session.get('admin_doc'));

UI.registerHelper(
  'admin_is_users_collection',
  () => Session.get('admin_collection_name') === 'Users'
);

UI.registerHelper('admin_sidebar_items', () => HomeDashboard.sidebarItems);

UI.registerHelper('admin_omit_fields', () => {
  let collection = undefined;
  let globalz = undefined;

  if (HomeConfig && HomeConfig.autoForm && HomeConfig.autoForm.omitFields) {
    globalz = HomeConfig.autoForm.omitFields;
  }

  if (!Session.equals('admin_collection_name', 'Users') && HomeConfig && HomeConfig.collections
      && HomeConfig.collections[Session.get('admin_collection_name')].omitFields === 'object') {
    collection = HomeConfig.collections[Session.get('admin_collection_name')].omitFields;
  }

  if (typeof globalz === 'object' && typeof collection === 'object') {
    return _.union(globalz, collection);
  } else if (typeof globalz === 'object') {
    return globalz;
  } else if (typeof collection === 'object') {
    return collection;
  }

  return {};
});

UI.registerHelper('AdminSchemas', () => HomeDashboard.schemas);

UI.registerHelper('adminGetSkin', () => {
  if (HomeConfig && HomeConfig.dashboard && HomeConfig.dashboard.skin) {
    return HomeConfig.dashboard.skin;
  }
  return 'blue';
});

UI.registerHelper('adminGetUsers', () => Meteor.users);

UI.registerHelper('adminGetUserSchema', () => {
  let schema = {};
  if (_.has(HomeConfig, 'userSchema')) {
    schema = HomeConfig.userSchema;
  } else {
    schema = Meteor.users.simpleSchema();
  }
  return schema;
});

UI.registerHelper('collectionLabel', (collection) => HomeDashboard.collectionLabel(collection));

UI.registerHelper('collectionsCount', (collection) => {
  if (collection === 'Users') {
    return Meteor.users.find().count();
  }

  const rows = collectionsCount.findOne({ collection });
  return rows ? rows.count : 0;
});

UI.registerHelper('adminTemplate', (collection, mode) => {
  let template = false;

  if (HomeConfig && HomeConfig.collections && HomeConfig.collections[collection]
      && HomeConfig.collections[collection].templates
      && HomeConfig.collections[collection].templates[mode]) {
    template = HomeConfig.collections[collection].templates[mode];
  }

  return template;
});

UI.registerHelper(
  'adminGetCollection',
  (collection) => _.find(adminCollections(), (item) => item.name === collection)
);

UI.registerHelper('adminWidgets', () => {
  let widgets = [];
  if (HomeConfig && HomeConfig.dashboard && HomeConfig.dashboard.widgets) {
    widgets = HomeConfig.dashboard.widgets;
  }
  return widgets;
});

UI.registerHelper('adminUserEmail', (emails) => {
  let email = false;
  if (emails && emails[0] && emails[0].address) {
    email = emails[0].address;
  }
  return email;
});

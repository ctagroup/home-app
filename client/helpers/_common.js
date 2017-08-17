/**
 * Created by udit on 08/07/16.
 */
import moment from 'moment';
import { logger } from '/imports/utils/logger';

UI.registerHelper(
  'currentUserCan', cap => Roles.userIsInRole(Meteor.user(), cap)
);

Template.registerHelper(
  'formatDate', date => (date ? moment.utc(date).format('MM/DD/YYYY') : '')
);

Template.registerHelper(
  'log', (data) => {
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
      return Router.path(data.path, {
        _id: data._id,
      });
    },
  }
);

UI.registerHelper(
  'newPath',
  () => Router.path(`adminDashboard${Session.get('admin_collection_name')}New`)
);

UI.registerHelper(
  'getGlobalHouseholdEditPath',
  _id => Router.path('adminDashboardglobalHouseholdsEdit', { _id })
);

UI.registerHelper(
  'getGlobalHouseholdNewPath',
  () => Router.path('adminDashboardglobalHouseholdsNew')
);

UI.registerHelper(
  'getClientViewPath',
  client => Router.path(
    'viewClient',
    { _id: client.clientId },
    { query: `isHMISClient=true&schema=${client.schema}` }
  )
);

// TODO: is it required?
// UI.registerHelper('AdminTables', AdminTables);

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

UI.registerHelper('log', (value, name = '') => {
  console.log(`Template ${name}`, value);
});

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

UI.registerHelper('collectionLabel', collection => HomeDashboard.collectionLabel(collection));

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
  collection => _.find(adminCollections(), item => item.name === collection)
);

UI.registerHelper('adminUserEmail', (emails) => {
  let email = false;
  if (emails && emails[0] && emails[0].address) {
    email = emails[0].address.toLowerCase();
  }
  return email;
});

UI.registerHelper('getTemplateData', () => {
  const tmpl = Template.instance();
  return tmpl.data;
});

UI.registerHelper('isUndefined', (v) => v === undefined);

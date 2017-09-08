import moment from 'moment';

Template.registerHelper('formatDate',
  date => (date ? moment.utc(date).format('MM/DD/YYYY') : '')
);

UI.registerHelper('log', (value, name = '') => {
  console.log(`Template ${name}`, value);
});

UI.registerHelper('isiOS', () => is.ios());
UI.registerHelper('isAndroid', () => is.android());
UI.registerHelper('isCordova', () => Meteor.isCordova);

UI.registerHelper('isUndefined', (v) => v === undefined);

UI.registerHelper('currentUserGravatar', () => HomeHelpers.getCurrentUserGravatar());
UI.registerHelper('currentUserFullName', () => HomeHelpers.getCurrentUserFullName());

// TODO: remove these helpers
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

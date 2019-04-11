import moment from 'moment';
import FeatureDecisions from '/imports/both/featureDecisions';
import { userName, userEmails } from '/imports/api/users/helpers';


Template.registerHelper('formatDate',
  date => (date ? moment.utc(date).format('MM/DD/YYYY') : '')
);

Template.registerHelper('formatDate99', date => {
  if (!date) return '';
  if (date === 99) return 'dnc';
  return moment.utc(date).format('MM/DD/YYYY');
});


Template.registerHelper('formatDateTime',
  date => (date ? moment.utc(date).format('MM/DD/YYYY hh:mm:ss A') : '')
);

UI.registerHelper('log', (value, name = '') => {
  console.log(`Template ${name}`, value); // eslint-disable-line no-console
});

UI.registerHelper('isiOS', () => is.ios());
UI.registerHelper('isAndroid', () => is.android());
UI.registerHelper('isCordova', () => Meteor.isCordova);
UI.registerHelper('isSkidrowApp', () =>
  FeatureDecisions.createFromMeteorSettings().isSkidrowApp()
);

UI.registerHelper('isUndefined', (v) => v === undefined);

UI.registerHelper('currentUserGravatar', () => {
  const user = Meteor.user();
  if (!user) {
    return '';
  }
  const url = Gravatar.imageUrl(userEmails(user)[0], { secure: true });
  return `<img class="avatar small" src="${url}" />`;
});

UI.registerHelper('currentUserFullName', () => {
  const user = Meteor.user() || {};
  return userName(user);
});

Template.registerHelper('equals', (v1, v2) => {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return _.isEqual(v1, v2);
  }
  return v1 === v2;
});

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

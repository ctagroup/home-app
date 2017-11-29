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

UI.registerHelper('currentUserGravatar', () => {
  const user = Meteor.user();
  const email = (user && user.emails && user.emails[0].address.toLowerCase()) || '';
  return `<img class="avatar small" src="${Gravatar.imageUrl(email, { secure: true })}" />`;
});

UI.registerHelper('currentUserFullName', () => {
  const user = Meteor.user();
  if (user && user.services && user.services.HMIS) {
    const { name, firstName, lastName } = user.services.HMIS;
    if (name) {
      return name.trim();
    }
    return `${firstName || ''} ${lastName || ''}`.trim();
  }
  if (user && user.emails && user.emails[0].address) {
    return user.emails[0].address.toLowerCase();
  }
  return '';
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

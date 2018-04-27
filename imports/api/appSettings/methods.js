import AppSettings from '/imports/api/appSettings/appSettings';

Meteor.methods({
  'app.buildInfo'() {
    return AppSettings.get('buildInfo', '');
  },
});

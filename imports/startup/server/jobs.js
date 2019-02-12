import { SyncedCron } from 'meteor/littledata:synced-cron';
SyncedCron.add({
  name: 'Reload Clients',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('every day');
  },
  job() {
    Meteor.call('reloadClients');
    return true;
  },
});

SyncedCron.add({
  name: 'Reload Surveys',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('every day');
  },
  job() {
    Meteor.call('reloadSurveys');
    return true;
  },
});

import { ReactiveVar } from 'meteor/reactive-var';
import './footer.html';

const buildInfo = new ReactiveVar('');

Template.Footer.helpers({
  currentYear: new Date().getFullYear(),
  buildInfo() {
    return buildInfo.get();
  },
});

Template.Footer.onRendered(() => {
  Meteor.call('app.buildInfo', (err, res) => {
    if (res) {
      buildInfo.set(res);
    }
  });
});

import { ReactiveVar } from 'meteor/reactive-var';
import './roisForm';
import './roisEdit.html';

Template.roisEdit.helpers({
  getRoi() {
    return Template.instance().roi.get();
  },
});

Template.roisEdit.events({
  'click button': (event) => {
    console.log('button', this, event);
    event.preventDefault();
  },
});

Template.roisEdit.onCreated(function onCreated() {
  this.roi = new ReactiveVar({
    loading: true,
  });

  this.autorun(() => {
    Meteor.call('roiApi', 'getRoi', this.data.id, (error, data) => {
      this.roi.set({
        error,
        data,
      });
    });

  });
});

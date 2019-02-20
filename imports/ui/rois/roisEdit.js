import Alert from '/imports/ui/alert';
import { ReactiveVar } from 'meteor/reactive-var';
import './roisForm';
import './roisEdit.html';

Template.roisEdit.helpers({
  getRoi() {
    return Template.instance().roi.get();
  },
  errors() {
    return Template.instance().errors.get();
  },
});

Template.roisEdit.events({
  'click button': (event, template) => {
    event.preventDefault();
    template.errors.set({});
    const data = {
      startDate: $('#startDate').val(),
      endDate: $('#endDate').val(),
      notes: $('#notes').val(),
    };
    const roiId = Router.current().params.id;
    Meteor.call('roiApi', 'updateRoi', roiId, data, (err) => {
      if (err) {
        Alert.error(err);
        template.errors.set(err.details && err.details.data);
      } else {
        Alert.success('ROI Signed');
        window.history.back();
      }
    });
  },
});

Template.roisEdit.onCreated(function onCreated() {
  this.errors = new ReactiveVar({});
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

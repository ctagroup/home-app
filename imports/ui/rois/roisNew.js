import Alert from '/imports/ui/alert';
import './roisForm';
import './roisNew.html';

Template.roisNew.helpers({
  errors() {
    return Template.instance().errors.get();
  },
});

Template.roisNew.onCreated(function onCreated() {
  this.errors = new ReactiveVar({});
});

Template.roisNew.events({
  'click button': (event, template) => {
    event.preventDefault();
    template.errors.set({});
    const data = {
      clientId: Router.current().params.query.dedupClientId,
      startDate: $('#startDate').val(),
      endDate: $('#endDate').val(),
      notes: $('#notes').val(),
      signature: Router.current().params.signaturePad.toDataURL(),
    };
    Meteor.call('roiApi', 'createRoi', data, (err) => {
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

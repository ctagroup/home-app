import Alert from '/imports/ui/alert';
import { formSchema } from './consentGroupFields';
import './consentGroupsNew.html';

Template.consentGroupsNew.helpers({
  schema() {
    return formSchema();
  },
  doc() {
    return this.doc;
  },
});

AutoForm.addHooks('consentGroupsNew', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    console.log('aaaa');
    Meteor.call('consentGroups.create', insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Consent Group created');
    Router.go('consentGroupsList');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

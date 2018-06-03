import Alert from '/imports/ui/alert';
import { formSchema } from './consentGroupFields';
import './consentGroupsEdit.html';


Template.consentGroupsEdit.helpers({
  schema() {
    return formSchema();
  },
  doc() {
    return this.doc;
  },
});

AutoForm.addHooks('consentGroupsEdit', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('consentGroups.update', { $set: insertDoc }, this.docId, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Consent Group updated');
    Router.go('consentGroupsList');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

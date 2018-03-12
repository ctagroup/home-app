import Alert from '/imports/ui/alert';
import { formSchema, doc2form, form2doc } from './agencyFields';
import './agenciesEdit.html';

Template.agenciesEdit.helpers({
  schema() {
    return formSchema(this.doc);
  },
  doc() {
    return doc2form(this.doc);
  },
});

AutoForm.addHooks('agenciesEdit', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('globalProjects.update', form2doc(insertDoc), this.docId, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Agency updated');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

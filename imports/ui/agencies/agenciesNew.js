import Alert from '/imports/ui/alert';
import { formSchema, form2doc } from './agencyFields';
import './agenciesNew.html';

Template.agenciesNew.helpers({
  schema() {
    return formSchema();
  },
  doc() {
    return this.doc;
  },
});

AutoForm.addHooks('agenciesNew', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('globalProjects.create', form2doc(insertDoc), (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess(formType, res) {
    Alert.success('Agency created');
    Router.go('agenciesEdit', { _id: res });
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

import Alert from '/imports/ui/alert';
import { formSchema } from './globalProjectFields';
import './globalProjectsNew.html';

Template.globalProjectsNew.helpers({
  schema() {
    return formSchema();
  },
  doc() {
    return this.doc;
  },
});

AutoForm.addHooks('globalProjectsNew', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    // Meteor.call('projects.create', insertDoc, (err, res) => {
    //   this.done(err, res);
    // });
    return false;
  },
  onSuccess() {
    Alert.success('Global Project created');
    Router.go('globalProjectsList');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

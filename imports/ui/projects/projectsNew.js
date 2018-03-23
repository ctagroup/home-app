import Alert from '/imports/ui/alert';
import { formSchema } from './projectFields';
import './projectsNew.html';

Template.projectsNew.helpers({
  schema() {
    return formSchema();
  },
  doc() {
    return this.doc;
  },
});

AutoForm.addHooks('projectsNew', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('projects.create', insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Project created');
    Router.go('projectsList');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

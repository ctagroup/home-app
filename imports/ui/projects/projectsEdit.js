import Alert from '/imports/ui/alert';
import { formSchema } from './projectFields';
import './projectsEdit.html';

Template.projectsEdit.helpers({
  schema() {
    return formSchema(this.doc);
  },
  doc() {
    console.log(this.doc);
    return this.doc;
  },
});

AutoForm.addHooks('projectsEdit', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    const { projectId, schema } = this.currentDoc;
    Meteor.call('projects.update', insertDoc, projectId, schema, (err, res) => {
      Router.go('projectsList');
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Project updated');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});


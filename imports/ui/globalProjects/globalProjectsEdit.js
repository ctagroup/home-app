import Alert from '/imports/ui/alert';
import { formSchema } from './globalProjectFields';
import './globalProjectsEdit.html';

Template.globalProjectsEdit.helpers({
  schema() {
    return formSchema(this.doc);
  },
  doc() {
    console.log(this.doc);
    return this.doc;
  },
});

AutoForm.addHooks('globalProjectsEdit', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    const { projectId, schema } = this.currentDoc;
    // Meteor.call('projects.update', insertDoc, projectId, schema, (err, res) => {
    //   Router.go('projectsList');
    //   this.done(err, res);
    // });
    return false;
  },
  onSuccess() {
    Alert.success('Global Project updated');
  },
  onError(formType, err) {
    Alert.error(err);
  },
});


import Alert from '/imports/ui/alert';
import { doc2form, formSchema } from './globalProjectFields';
import './globalProjectsNew.html';

Template.globalProjectsNew.helpers({
  schema() {
    return formSchema(this.doc);
  },
  doc() {
    return doc2form(this.doc);
  },
});

AutoForm.addHooks('globalProjectsNew', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    console.log('ins', insertDoc);
    Meteor.call('globalProjects.create', insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Global Project created');
    Router.go('globalProjectsList');
    location.reload();
  },
  onError(formType, err) {
    Alert.error(err);
  },
});

import Alert from '/imports/ui/alert';
import { doc2form, formSchema } from './globalProjectFields';
import './globalProjectsEdit.html';

Template.globalProjectsEdit.helpers({
  schema() {
    return formSchema(this.doc);
  },
  doc() {
    return doc2form(this.doc);
  },
});

AutoForm.addHooks('globalProjectsEdit', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    const { _id } = this.currentDoc;
    console.log('upd', insertDoc, this.currentDoc);
    Meteor.call('globalProjects.update', insertDoc, _id, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Alert.success('Global Project updated');
    Router.go('globalProjectsList');
    location.reload();
  },
  onError(formType, err) {
    Alert.error(err);
  },
});


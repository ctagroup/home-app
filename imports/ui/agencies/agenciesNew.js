import Alert from '/imports/ui/alert';
import { doc2form, form2doc } from './agencyFields';
import './agenciesNew.html';

Template.agenciesNew.helpers({
  formData() {
    return doc2form(this.doc);
  },
});

AutoForm.hooks({
  agenciesNew: {
    docToForm(doc) {
      return doc2form(doc);
    },
    formToDoc(doc) {
      return form2doc(doc);
    },
    onError(type, err) {
      Alert.error(err);
    },
    onSuccess() {
      Alert.success('New Agency created');
      Router.go('agenciesList');
    },
  },
});

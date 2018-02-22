import Alert from '/imports/ui/alert';
import { doc2form, form2doc } from './agencyFields';
import './agenciesEdit.html';

AutoForm.hooks({
  agenciesEdit: {
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
      Alert.success('Agency updated');
      //Router.go('agenciesList');
    },
  },
});

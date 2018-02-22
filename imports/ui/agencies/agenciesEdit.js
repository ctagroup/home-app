import Alert from '/imports/ui/alert';
import './agencyFields';
import './agenciesEdit.html';

AutoForm.hooks({
  agenciesEdit: {
    onError(type, err) {
      Alert.error(err);
    },
    onSuccess() {
      Alert.success('Agency updated');
      Router.go('agenciesList');
    },
  },
});

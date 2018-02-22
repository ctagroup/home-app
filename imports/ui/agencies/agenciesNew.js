import Alert from '/imports/ui/alert';
import './agencyFields';
import './agenciesNew.html';

AutoForm.hooks({
  agenciesNew: {
    onError(type, err) {
      Alert.error(err);
    },
    onSuccess() {
      Alert.success('New Agency created');
      Router.go('agenciesList');
    },
  },
});

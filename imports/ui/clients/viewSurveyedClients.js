import './viewSurveyedClients.html';
import SurveyedClientsList from '/imports/ui/components/pages/SurveyedClientsList';

Template.viewSurveyedClients.helpers({
  component() {
    return SurveyedClientsList;
  },
});

import ResponsesList from '/imports/ui/responses/components/ResponsesList';
import './responsesListView.html';

Template.responsesListView.helpers({
  component() {
    return ResponsesList;
  },
});

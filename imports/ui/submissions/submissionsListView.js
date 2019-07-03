import SubmissionsList from '/imports/ui/submissions/components/SubmissionsList';
import './submissionsListView.html';


Template.submissionsListView.helpers({
  SubmissionsList() {
    return SubmissionsList;
  },
});

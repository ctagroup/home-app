import './editSubmission.html';
import SubmissionContainer from '/imports/ui/submissions/components/SubmissionContainer';

Template.editSubmission.helpers({
  SubmissionContainer() {
    return SubmissionContainer;
  },
});

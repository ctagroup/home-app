/**
 * Created by Mj on 11/3/2016.
 */
Template.responsesListView.events(
  {
    'click .UploadResponses': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('id');
      $(`#${responseId}`).html('<i class="fa fa-spinner fa-pulse"></i>');
      responseHmisHelpers.sendResponseToHmis(responseId, (res) => {
        // Calculate the scores now and send them too.
        if (!res) {
          // change the button back to what it was.
          $(`#${responseId}`).html('Upload to HMIS');
        } else {
          // save the submission Id first.
          Meteor.call('updateSubmissionIdForResponses', responseId, res.submissionId, () => {
            // change button to completed.
            $(`#${responseId}`).parent()
              .html('<span class="text-success"><i class="fa fa-check"></i>Submitted</span>');
          });
        }
      });
    },
  }
);

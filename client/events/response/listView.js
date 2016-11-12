/**
 * Created by Mj on 11/3/2016.
 */
Template.responsesListView.events(
  {
    'click .UploadResponses': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('id');
      $(`#${responseId}`).html('<i class="fa fa-spinner fa-pulse"></i>');
      // Checking if SPDAT or HUD. If SPDAT, then only upload.
      const response = responses.findOne({ _id: responseId });
      const survey
        = surveys.findOne({ _id: response.surveyID });
      if (survey.stype !== 'hud') {
        responseHmisHelpers.sendResponseToHmis(responseId, (res) => {
          if (!res) {
            // change the button back to what it was.
            $(`#${responseId}`).html('Upload to HMIS');
          } else {
            // Calculate the scores now and send them too.
            let score;
            // Send response Id, survey Id and fromDb to true to score helpers.
            switch (survey.stype) {
              case 'spdat-t':
                score = spdatScoreHelpers.calcSpdatTayScore(survey._id, responseId, true);
                // upload the scores too.
                break;
              case 'spdat-f':
                score = spdatScoreHelpers.calcSpdatFamilyScore(survey._id, responseId, true);
                break;
              case 'spdat-s':
                score = spdatScoreHelpers.calcSpdatSingleScore(survey._id, responseId, true);
                break;
              default:
                score = 0;
                // Should be other than VI-SPDAT.
                break;
            }
            // On getting the scores, update them.
            Meteor.call(
              'sendScoresToHMIS', survey.apiSurveyServiceId, response.clientID, score,
              (er, re) => {
                if (er) {
                  logger.log(er);
                } else {
                  logger.log(re);
                }
              }
            );
            // save the submission Id.
            Meteor.call('updateSubmissionIdForResponses', responseId, res.submissionId, () => {
              // change button to completed.
              $(`#${responseId}`).parent()
                .html('<span class="text-success"><i class="fa fa-check"></i>Submitted</span>');
            });
          }
        });
      } else {
        // TODO Upload for HUD.
      }
    },
  }
);

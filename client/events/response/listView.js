/**
 * Created by Mj on 11/3/2016.
 */
Template.responsesListView.events(
  {
    'click .UploadResponses': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('id');

      $(`#${responseId}`).parent().html('<i class="fa fa-spinner fa-pulse"></i>');
      // Checking if SPDAT or HUD. If SPDAT, then only upload.
      const response = responses.findOne({ _id: responseId });
      const survey
        = surveys.findOne({ _id: response.surveyID });
      if (survey.stype !== 'hud') {
        Meteor.call('updateResponseStatus', responseId, 'Uploading', () => {
          responseHmisHelpers.sendResponseToHmis(responseId, {}, true, (res) => {
            if (res) {
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
                    Meteor.call('updateResponseStatus', responseId, 'Completed', () => {});
                  } else {
                    logger.log(re);
                  }
                }
              );
              // save the submission Id.
              Meteor.call('updateSubmissionIdForResponses', responseId, res.submissionId, () => {
                const htmlOk = '<span class="text-success">' +
                  '<i class="fa fa-check"></i> ' +
                  'Submitted' +
                  '</span>' +
                  '<br>' +
                  `<a id="${responseId}" href="#" class="btn UploadResponses">` +
                  '(Re-Upload to HMIS)</a>';
                // change button to completed.
                $(`#${responseId}`).parent()
                  .html(htmlOk);

                Meteor.call('updateResponseStatus', responseId, 'Completed', () => {});
              });
            } else {
              Meteor.call('updateResponseStatus', responseId, 'Completed', () => {});
            }
          });
        });
      } else {
        // TODO Upload for HUD.
      }
    },
  }
);

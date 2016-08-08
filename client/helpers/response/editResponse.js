/**
 * Created by udit on 08/08/16.
 */

Template.editResponse.helpers(
  {
    paused() {
      let flag = false;

      const responseRecord = responses.findOne({ _id: Router.current().params._id });

      if (responseRecord && responseRecord.responsestatus) {
        const status = responseRecord.responsestatus;
        if (status === 'Paused') {
          // $('.savePaused_survey').show();
          // $('.pausePaused_survey').show();
          // $('.cancelPaused_survey').show();
          // $('#pauseSurvey').show();
          flag = true;
        }
      }

      return flag;
    },
  }
);

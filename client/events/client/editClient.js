/**
 * Created by udit on 01/08/16.
 */


Template.editClient.events(
  {
    'click .update': (evt, tmpl) => {
      const firstName = tmpl.find('.firstName').value;
      const middleName = tmpl.find('.middleName').value;
      const lastName = tmpl.find('.lastName').value;
      const suffix = tmpl.find('.suffix').value;
      const photo = tmpl.find('.photo').value;
      const ssn = tmpl.find('.ssn').value;
      const dob = tmpl.find('.dob').value;
      const race = tmpl.find('.race_category').value;
      const ethnicity = tmpl.find('.ethnicity_category').value;
      const gender = tmpl.find('.gender_category').value;
      const veteranStatus = tmpl.find('.veteranStatus_category').value;
      const disablingConditions = tmpl.find('.disablingConditions_category').value;
      Meteor.call(
        'updateClient', tmpl.data._id, firstName, middleName, lastName,
        suffix, photo, ssn, dob, race, ethnicity, gender, veteranStatus,
        disablingConditions,
        (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
            Router.go('viewClient', { _id: tmpl.data._id });
          }
        }
      );
    },
    'click .delete': (evt, tmpl) => {
      Meteor.call(
        'removeClient', tmpl.data._id, (error) => {
          if (error) {
            // console.log(error);
          } else {
            // console.log(result);
            Router.go('adminDashboardclientsView', {}, { query: 'deleted=1' });
          }
        }
      );
    },
    'click .back': (evt, tmpl) => {
      Router.go('viewClient', { _id: tmpl.data._id });
    },
  }
);

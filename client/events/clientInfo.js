/**
 * Created by Kavi on 4/5/16.
 */

Template.createClient.events(
  {
    'click .save'(evt, tmpl) {
      const firstName = tmpl.find('.firstName').value;
      const middleName = tmpl.find('.middleName').value;
      const lastName = tmpl.find('.lastName').value;
      const suffix = tmpl.find('.suffix').value;
      const ssn = tmpl.find('.ssn').value;
      const dob = tmpl.find('.dob').value;
      const race = tmpl.find('.race_category').value;
      const ethnicity = tmpl.find('.ethnicity_category').value;
      const gender = tmpl.find('.gender_category').value;
      const veteranStatus = tmpl.find('.veteranStatus_category').value;
      const disablingConditions = tmpl.find('.disablingConditions_category').value;
      const residencePrior = tmpl.find('.residencePrior_category').value;
      const entryDate = tmpl.find('.entryDate').value;
      const exitDate = tmpl.find('.exitDate').value;
      const destination = tmpl.find('.destinationCategory').value;
      const householdId = tmpl.find('.householdId').value;
      const relationship = tmpl.find('.relationtoHoH_category').value;
      const loc = tmpl.find('.loc').value;
      const shelter = tmpl.find('.timeOnStreets_category').value;
      Meteor.call(
        'addClient', firstName, middleName, lastName, suffix, ssn,
        dob, race, ethnicity, gender, veteranStatus, disablingConditions, residencePrior, entryDate,
        exitDate, destination, householdId, relationship, loc, shelter, (error, result) => {
          if (error) {
            // console.log(error);
          } else {
            const clientInfoId = result;
            // console.log(result);
            Router.go('viewClient', { _id: clientInfoId });
          }
        }
      );
    },
  }
);

Template.viewClient.events(
  {
    'click .edit'(evt, tmpl) {
      const query = {};
      if (tmpl.data.isHMISClient) {
        query.query = 'isHMISClient=true';
      }
      Router.go('editClient', { _id: tmpl.data._id }, query);
    },
    'click .back'() {
      Router.go('searchClient');
    },
    'click .add-to-hmis'(event, tmpl) {
      Meteor.call(
        'addClientToHMIS', tmpl.data._id, (error, result) => {
          if (error) {
            // console.log(error);
          } else {
            const query = (
                            result
                          ) ? 'addedToHMIS=1' : 'addClientToHMISError=1';
            Router.go('viewClient', { _id: tmpl.data._id }, { query });
          }
        }
      );
    },
    'click .takeSurvey'(event, tmpl) {
      const query = {};

      if (Router.current().params && Router.current().params.query
        && Router.current().params.query.isHMISClient && Router.current().params.query.link) {
        const url = encodeURIComponent(Router.current().params.query.link);
        query.query = {
          isHMISClient: true,
          link: url,
        };
        // `isHMISClient=true&link=${url}`
      }

      Router.go('LogSurvey', { _id: tmpl.data._id }, query);
    },
  }
);

Template.editClient.events(
  {
    'click .update'(evt, tmpl) {
      const firstName = tmpl.find('.firstName').value;
      const middleName = tmpl.find('.middleName').value;
      const lastName = tmpl.find('.lastName').value;
      const suffix = tmpl.find('.suffix').value;
      const ssn = tmpl.find('.ssn').value;
      const dob = tmpl.find('.dob').value;
      const race = tmpl.find('.race_category').value;
      const ethnicity = tmpl.find('.ethnicity_category').value;
      const gender = tmpl.find('.gender_category').value;
      const veteranStatus = tmpl.find('.veteranStatus_category').value;
      const disablingConditions = tmpl.find('.disablingConditions_category').value;
      const residencePrior = tmpl.find('.residencePrior_category').value;
      const entryDate = tmpl.find('.entryDate').value;
      const exitDate = tmpl.find('.exitDate').value;
      const destination = tmpl.find('.destinationCategory').value;
      const householdId = tmpl.find('.householdId').value;
      const relationship = tmpl.find('.relationtoHoH_category').value;
      const loc = tmpl.find('.loc').value;
      const shelter = tmpl.find('.timeOnStreets_category').value;
      Meteor.call(
        'updateClient', tmpl.data._id, firstName, middleName, lastName,
        suffix, ssn, dob, race, ethnicity, gender, veteranStatus,
        disablingConditions, residencePrior, entryDate, exitDate, destination,
        householdId, relationship, loc,
        shelter,
        (error, result) => {
          if (error) {
            // console.log(error);
          } else {
            const clientInfoId = result;
            // console.log(result);
            Router.go('viewClient', { _id: clientInfoId });
          }
        }
      );
    },
    'click .delete'(evt, tmpl) {
      Meteor.call(
        'removeClient', tmpl.data._id, (error) => {
          if (error) {
            // console.log(error);
          } else {
            // console.log(result);
            Router.go('searchClient', {}, { query: 'deleted=1' });
          }
        }
      );
    },
    'click .back'(evt, tmpl) {
      Router.go('viewClient', { _id: tmpl.data._id });
    },
  }
);


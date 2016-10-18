Template.createClient.onRendered(() => {
  const template = Template.instance();
  template.autorun(() => {
    if (!PreliminarySurvey.showPreliminarySurvey()) {
      PreliminarySurvey.showReleaseOfInformation();
    }
  });
});

Template.createClient.events(
  {
    'click .save': (evt, tmpl) => {
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
      const residencePrior = tmpl.find('.residencePrior_category').value;
      const entryDate = tmpl.find('.entryDate').value;
      const exitDate = tmpl.find('.exitDate').value;
      const destination = tmpl.find('.destinationCategory').value;
      const relationship = tmpl.find('.relationtoHoH_category').value;
      const loc = tmpl.find('.loc').value;
      const shelter = tmpl.find('.timeOnStreets_category').value;
      const signature = tmpl.find('.signature') ? tmpl.find('.signature').value : '';
      Meteor.call(
        'addClient', firstName, middleName, lastName, suffix, photo, ssn,
        dob, race, ethnicity, gender, veteranStatus, disablingConditions, residencePrior, entryDate,
        exitDate, destination, relationship, loc, shelter, signature,
        (error, result) => {
          if (error) {
            // console.log(error);
          } else {
            const clientId = result;
            // console.log(result);
            Router.go('viewClient', { _id: clientId });
          }
        }
      );
    },
  }
);

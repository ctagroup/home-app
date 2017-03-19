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
      const emailAddress = tmpl.find('.emailAddress').value;
      const phoneNumber = tmpl.find('.phoneNumber').value;
      const photo = tmpl.find('.photo').value;
      const ssn = tmpl.find('.ssn').value;
      const dob = tmpl.find('.dob').value;
      const race = tmpl.find('.race_category').value;
      const ethnicity = tmpl.find('.ethnicity_category').value;
      const gender = tmpl.find('.gender_category').value;
      const veteranStatus = tmpl.find('.veteranStatus_category').value;
      const disablingConditions = tmpl.find('.disablingConditions_category').value;
      const signature = tmpl.find('.signature') ? tmpl.find('.signature').value : '';
      Meteor.call(
        'addClient', firstName, middleName, lastName, suffix,
        emailAddress, phoneNumber, photo, ssn, dob, race, ethnicity,
        gender, veteranStatus, disablingConditions,
        signature,
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
    'click .cancel-client-creation': () => {
      history.back();
    },
  }
);

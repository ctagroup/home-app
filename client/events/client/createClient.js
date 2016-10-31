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
      const signature = tmpl.find('.signature') ? tmpl.find('.signature').value : '';

    

        // To set alert message if the fields are empty.
         var elements = document.getElementsByTagName("INPUT");
         var flag=0;
           // var errorMessage =document.getElementsByTagName("span"); 
      for(var i=0; i < elements.length; i++){
            if(elements[i].value === "")
          {
            elements[i].style.borderColor="red";
            flag=1;
           
         }
}
if(flag==1)
{
  alert("The required fields cannot be blank");
}


      Meteor.call(
        'addClient', firstName, middleName, lastName, suffix, photo, ssn,
        dob, race, ethnicity, gender, veteranStatus, disablingConditions,
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
  }
);

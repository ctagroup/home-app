/**
 * Created by Kavi on 4/5/16.
 */
ClientProfileSchema = new Meteor.Collection('clientInfoSchema');
var clientInfoId;
Template.createClient.events({


    'click .save':function(evt,tmpl){

        var first_name = tmpl.find('.firstName').value;
        var middle_name = tmpl.find('.middleName').value;
        var last_name = tmpl.find('.lastName').value;
        var suffix = tmpl.find('.suffix').value;
        var ssn = tmpl.find('.ssn').value;
        var dob = tmpl.find('.dob').value;
        var race = tmpl.find('.race_category').value;
        var ethnicity = tmpl.find('.ethnicity_category').value;
        var gender = tmpl.find('.gender_category').value;
        var veteran_status = tmpl.find('.veteranStatus_category').value;
        var disabling_conditions = tmpl.find('.disablingConditions_category').value;
        var residence_prior = tmpl.find('.residencePrior_category').value;
        var entry_date = tmpl.find('.entry_date').value;
        var exit_date = tmpl.find('.exit_date').value;
        var destination = tmpl.find('.destination_category').value;
        var personal_id = tmpl.find('.personal_id').value;
        var housing_id = tmpl.find('.housing_id').value;
        var relationship = tmpl.find('.relationtoHoH_category').value;
        var loc = tmpl.find('.destination_category').value;
        var shelter = tmpl.find('.timeOnStreets_category').value;


        Meteor.call("addClient", first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteran_status,disabling_conditions,residence_prior,entry_date,exit_date,destination,personal_id,housing_id,relationship,loc,shelter, function ( error, result ) {
            if ( error ) {
                console.log(error);
            } else {
                clientInfoId = result;
                Router.go('viewClient', {_id:clientInfoId});
                console.log(result);
            }
        } );

    }

});
Template.createClient.clientInfoList = function(evt,tmpl){

    var clientInfoCollection = adminCollectionObject("clientInfo");
    return clientInfoCollection.find({}).fetch();
}
Template.viewClient.events({
    'click .edit':function(evt,tmpl){
        Router.go( 'clientProfileEdit', { _id: tmpl.data._id } );
    }
});
Template.clientProfileEdit.events({

    'click .update':function(evt,tmpl){

        var first_name = tmpl.find('.firstName').value;
        var middle_name = tmpl.find('.middleName').value;
        var last_name = tmpl.find('.lastName').value;
        var suffix = tmpl.find('.suffix').value;
        var ssn = tmpl.find('.ssn').value;
        var dob = tmpl.find('.dob').value;
        var race = tmpl.find('.race_category').value;
        var ethnicity = tmpl.find('.ethnicity_category').value;
        var gender = tmpl.find('.gender_category').value;
        var veteran_status = tmpl.find('.veteranStatus_category').value;
        var disabling_conditions = tmpl.find('.disablingConditions_category').value;
        var residence_prior = tmpl.find('.residencePrior_category').value;
        var entry_date = tmpl.find('.entry_date').value;
        var exit_date = tmpl.find('.exit_date').value;
        var destination = tmpl.find('.destination_category').value;
        var personal_id = tmpl.find('.personal_id').value;
        var housing_id = tmpl.find('.housing_id').value;
        var relationship = tmpl.find('.relationtoHoH_category').value;
        var loc = tmpl.find('.destination_category').value;
        var shelter = tmpl.find('.timeOnStreets_category').value;

        Meteor.call("updateClient", clientInfoId, first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteran_status,disabling_conditions,residence_prior,entry_date,exit_date,destination,personal_id,housing_id,relationship,loc,shelter,function ( error, result ) {
            if ( error ) {
                console.log(error);
            } else {
                console.log(result);
                alert("Client profile has been updated");
            }
        } );
    },
    'click .delete':function(){

        Meteor.call("removeClient", clientInfoId, function ( error, result ) {
            if ( error ) {
                console.log(error);
            } else {
                console.log(result);
                alert("Client profile is deleted");
            }
        } );

    }

})





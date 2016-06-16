/**
 * Created by Kavi on 4/5/16.
 */

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
        var veteranStatus = tmpl.find('.veteranStatus_category').value;
        var disablingConditions = tmpl.find('.disablingConditions_category').value;
        var residencePrior = tmpl.find('.residencePrior_category').value;
        var entryDate = tmpl.find('.entryDate').value;
        var exitDate = tmpl.find('.exitDate').value;
        var destination = tmpl.find('.destination_category').value;
        var personalId = tmpl.find('.personalId').value;
        var householdId = tmpl.find('.householdId').value;
        var relationship = tmpl.find('.relationtoHoH_category').value;
        var loc = tmpl.find('.destination_category').value;
        var shelter = tmpl.find('.timeOnStreets_category').value;


        Meteor.call("addClient", first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteranStatus,disablingConditions,residencePrior,entryDate,exitDate,destination,personalId,householdId,relationship,loc,shelter, function ( error, result ) {
            if ( error ) {
                console.log(error);
            } else {
                var clientInfoId = result;
	            console.log(result);
                Router.go('viewClient', {_id:clientInfoId});
            }
        } );

    }

});

Template.viewClient.events(
	{
	    'click .edit':function(evt,tmpl){
	        Router.go( 'editClient', { _id: tmpl.data._id } );
	    },
	    'click .back':function(evt,tmpl){
	        Router.go( 'searchClient' );
	    },
	   'click .add-to-hmis': function (evt, tmpl) {
		   Meteor.call( 'addClientToHMIS', tmpl.data._id, function ( error, result ) {
			   if ( error ) {
				   console.log(error);
			   } else {
				   var query = (result) ? "addedToHMIS=1" : "addClientToHMISError=1";
				   Router.go("viewClient", { _id: tmpl.data._id }, { query: query } );
			   }
		   } );
	   }
	}
);

Template.editClient.events({

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
        var veteranStatus = tmpl.find('.veteranStatus_category').value;
        var disablingConditions = tmpl.find('.disablingConditions_category').value;
        var residencePrior = tmpl.find('.residencePrior_category').value;
        var entryDate = tmpl.find('.entryDate').value;
        var exitDate = tmpl.find('.exitDate').value;
        var destination = tmpl.find('.destination_category').value;
        var personalId = tmpl.find('.personalId').value;
        var householdId = tmpl.find('.householdId').value;
        var relationship = tmpl.find('.relationtoHoH_category').value;
        var loc = tmpl.find('.destination_category').value;
        var shelter = tmpl.find('.timeOnStreets_category').value;

        Meteor.call("updateClient", tmpl.data._id, first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteranStatus,disablingConditions,residencePrior,entryDate,exitDate,destination,personalId,householdId,relationship,loc,shelter,function ( error, result ) {
            if ( error ) {
                console.log(error);
            } else {
                console.log(result);
                Router.go("viewClient", { _id: tmpl.data._id }, { query: "updated=1" } );
            }
        } );
    },
    'click .delete':function(evt, tmpl){

        Meteor.call("removeClient", tmpl.data._id, function ( error, result ) {
            if ( error ) {
                console.log(error);
            } else {
                console.log(result);
	            Router.go("searchClient", {}, { query: "deleted=1" } );
            }
        } );

    },
	'click .back':function(evt,tmpl){
		Router.go( 'viewClient', { _id: tmpl.data._id } );
	},

})





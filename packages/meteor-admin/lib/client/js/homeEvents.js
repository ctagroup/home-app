/**
 * Created by udit on 10/02/16.
 */
Template.AdminRoleManager.events(
	{
		'click .js-update': function(e) {
			e.preventDefault();
			var serializeInput = $("#js-frm-role-manager" ).serializeArray();
			$("#js-frm-role-manager :input" ).attr("disabled", true);
			Meteor.call("updateRolePermissions", serializeInput, function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
				$("#js-frm-role-manager :input" ).attr("disabled", false);
			} );
		},
		'click .js-reset': function(e) {
			e.preventDefault();
			Meteor.call("resetRolePermissions", function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );
		}
	}
);

Template.surveyForm.events(
	{

		'click .save':function(evt,tmpl){

			var title = tmpl.find('.survey_title').value;
			var active = tmpl.find('.active').checked;
			var skip = tmpl.find('.skip').checked;
			var copy = tmpl.find('.copy').checked;
			var isUpdate = $('#isUpdate').val();
			var surveyID = $('#surveyID').val();

			if(isUpdate=='1'){

				Meteor.call("updateSurvey", surveyID, title, active, skip, copy, function ( error, result ) {
					if ( error ) {
						console.log(error);
					} else {
						console.log(result);
					}
				} );
			}else {

				Meteor.call("addSurvey", title, active, skip, copy, function ( error, result ) {
					if ( error ) {
						console.log(error);
					} else {
						console.log(result);
					}
				} );
			}
			resetSurveyModal();
		},
		'click .cancel':function(evt,tmpl){

		},
		'click .remove':function(evt,tmpl){
			var surveyID = tmpl.data._id;
			Meteor.call("removeSurvey", surveyID, function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );
			resetSurveyModal();
		}

	}
);

var resetSurveyModal = function() {
	$('#newSurveyModal input[type=text]').val('');
	$('#newSurveyModal input[type=checkbox]' ).attr('checked', false);
	$('#newSurveyModal input[type=checkbox]' ).prop('checked', false);
	$('#isUpdate').val('0');
	$('#surveyID').val('');
};

Template.surveyViewTemplate.events(
	{

		'click .addSurvey':function(evt,tmpl){
			resetSurveyModal();
			$('#myModalLabel').html("Add Survey");
			$('.save').removeClass('btn-warning').addClass('btn-primary');
			$('.save').html("Save");
			$('.remove').hide();
		}
	}
);
Template.surveyRow.events(
	{

		'click .edit':function(evt,tmpl){
			var surveyCollection = adminCollectionObject("surveys");
			var survey = surveyCollection.findOne({_id:tmpl.data._id});
			$('#newSurveyModal input[type=text]').val(survey.title);
			$('#newSurveyModal input[type=checkbox]#active' ).attr('checked', survey.active);
			$('#newSurveyModal input[type=checkbox]#active' ).prop('checked', survey.active);
			$('#newSurveyModal input[type=checkbox]#skip' ).attr('checked', survey.skip);
			$('#newSurveyModal input[type=checkbox]#skip' ).prop('checked', survey.skip);
			$('#newSurveyModal input[type=checkbox]#copy' ).attr('checked', survey.copy);
			$('#newSurveyModal input[type=checkbox]#copy' ).prop('checked', survey.copy);

			$('#isUpdate').val('1');
			$('#surveyID').val(tmpl.data._id);

			$('#myModalLabel').html("Update Survey");
			$('.save').removeClass('btn-primary').addClass('btn-warning');
			$('.save').html("Update");
			$('.remove').show();
		}
	}
);

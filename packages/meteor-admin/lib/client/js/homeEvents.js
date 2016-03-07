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
			resetSurveyModal();
		},
		'click .close':function(evt,tmpl){
			resetSurveyModal();
		},
		'click .remove':function(evt,tmpl){
			var surveyID = $('#surveyID').val();
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

var resetQuestionModal = function() {
	$('#newQuestionModal input[type=text]').val('');
	$('#newQuestionModal select').val('' ).change();
	$('#newQuestionModal input[type=checkbox]' ).attr('checked', false);
	$('#newQuestionModal input[type=checkbox]' ).prop('checked', false);
	$('.isCopySet' ).hide();
	$('#isUpdate').val('0');
	$('#questionID').val('');
}

var checkLocked=function(){
	var toggle = $( '#locked' ).is(':checked');
	if(toggle){
		setFields(true);
	}else{
		setFields(false);
	}
};
var setFields=function(status){
	$('#isCopy').attr('disabled', status);
	$('#q_copy').attr('disabled', status);
	$('#q_category').attr('disabled', status);
	$('#q_name').attr('disabled', status);
	$('#question').attr('disabled', status);
	$('#hud').attr('disabled', status);
	$('#q_dataType').attr('disabled', status);
};

Template.surveyViewTemplate.events(
	{

		'click .addSurvey':function(evt,tmpl){
			resetSurveyModal();
			$('.showWhenEdit').hide();
			$('.showWhenNew').show();
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

			$('.showWhenEdit').show();
			$('.showWhenNew').hide();

		}
	}
);

Template.questionViewTemplate.events(
	{
		'click .addQuestion':function(evt,tmpl){
			resetQuestionModal();
			$('.showWhenEdit').hide();
			$('.showWhenNew').show();
		}
	}
);

Template.questionForm.events(
	{
		'click .toggle': function(evt,tmpl) {
			var isCopy = $('#isCopy').is(':checked');
			if(isCopy){
				$('.isCopySet' ).show();
			}else{
				$('.isCopySet' ).hide();
			}

		},
		'change .q_copy' : function(evt,tmpl){

			var value = $('#q_copy').val();
			var text = value;
			//To be done


		},
		'change .q_dataType' : function(evt,tmpl){
			var datatype = $(evt.target).val();
			if(datatype=="Multiple Select" || datatype=="Single Select" ) {
				$( '#options,#options_label' ).removeClass('hide');
			} else {
				$( '#options,#options_label' ).addClass('hide');
			}

		},
		'change .locked' : function(evt,tmpl){
			checkLocked();
		},
		'click .save':function(evt,tmpl){

			var q_category=tmpl.find('.q_category').value;
			var q_name = tmpl.find('.q_name').value;
			var question = tmpl.find('.question').value;

			var q_dataType = tmpl.find('.q_dataType').value;
			var hud = tmpl.find('#hud').checked;
			var locked = tmpl.find('#locked').checked;

			var isCopy = tmpl.find('#isCopy').checked;

			if((q_dataType=="Multiple Select")||(q_dataType=="Single Select"))
				var options = tmpl.find('#options').value;
			else
				var options="";

			var isUpdate = $('#isUpdate').val();
			var questionID = $('#questionID').val();

			if(isUpdate=='1'){

				Meteor.call("updateQuestion", questionID, q_category,q_name,question,q_dataType,options,hud,locked,isCopy, function ( error, result ) {
					if ( error ) {
						console.log(error);
					} else {
						console.log(result);
					}
				} );

			}else{

				Meteor.call("addQuestion", q_category,q_name,question,q_dataType,options,hud,locked,isCopy, function ( error, result ) {
					if ( error ) {
						console.log(error);
					} else {
						console.log(result);
					}
				} );

			}

			resetQuestionModal();
		},
		'click .cancel':function(evt,tmpl){
			resetQuestionModal();
		},
		'click .close':function(evt,tmpl){
			resetQuestionModal();
		},
		'click .remove':function(evt,tmpl){

			var questionID = $('#questionID').val();
			Meteor.call("removeQuestion", questionID, function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );

			resetQuestionModal();
		}
	}
);

Template.questionRow.events(
	{
		'click .edit':function(evt,tmpl){
			var questionsCollection = adminCollectionObject("questions");
			var question = questionsCollection.findOne({_id:tmpl.data._id});

			$('#q_category').val(question.category).change();
			$('#q_name' ).val(question.name);
			$('#question' ).val(question.question);
			$('#q_dataType' ).val(question.dataType ).change();
			$('#options' ).val(question.options );

			$('#newQuestionModal input[type=checkbox]#isCopy' ).attr('checked', question.isCopy);
			$('#newQuestionModal input[type=checkbox]#isCopy' ).prop('checked', question.isCopy);
			$('#newQuestionModal input[type=checkbox]#hud' ).attr('checked', question.hud);
			$('#newQuestionModal input[type=checkbox]#hud' ).prop('checked', question.hud);
			$('#newQuestionModal input[type=checkbox]#locked' ).attr('checked', question.locked);
			$('#newQuestionModal input[type=checkbox]#locked' ).prop('checked', question.locked);

			$('#isUpdate').val('1');
			$('#questionID').val(tmpl.data._id);

			$('.showWhenEdit').show();
			$('.showWhenNew').hide();
		},
		'click .delete':function(evt,tmpl){

			Meteor.call("removeQuestion", tmpl.data._id, function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );

			resetQuestionModal();

		}
	}
);

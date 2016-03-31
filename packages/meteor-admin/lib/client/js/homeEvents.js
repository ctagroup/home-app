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
			
			
			var surveyID = $('#surveyID').val();
			var copy = tmpl.find('.copy').checked;
			var skip = tmpl.find('.skip').checked;
			var title = tmpl.find('.survey_title').value;
			var active = tmpl.find('.active').checked;
		

			var isUpdate = $('#isUpdate').val();
		
			console.log("SURVEY_ID: " + surveyID);
			console.log("isUpdate: " + isUpdate);

			alert("T: " + title + "A: " + active + "C: " + copy);
			
			if(isUpdate=='1'){

			var surveyCollection = adminCollectionObject("surveys");
			var survey = surveyCollection.findOne({_id:surveyID});
			var update_copy = survey.copy;

			if(update_copy){
				var title = tmpl.find('.copyof_surveytitle').value;
				var active = tmpl.find('.copy_active').checked;	
				var skip = tmpl.find('.skip').checked;
				var copy = update_copy;
			}else{
				var skip = tmpl.find('.skip').checked;
				var title = tmpl.find('.survey_title').value;
				var active = tmpl.find('.active').checked;
				var copy = update_copy;
			}
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
		'click .copy': function(evt,tmpl) {
			//resetSurveyModal();
			var copy = $('#copy').is(':checked');
			 if(copy){
					
				$('.isCopyTrue' ).show();
				$('.copyof_surveytitle').show();
				$('.copy_active').show();
				$('.survey_title').hide();
				$('.active').hide();


			 }else{
				
				$('.isCopyTrue' ).hide();
				$('.copyof_surveytitle').hide();
				$('.copy_active').hide();
				$('.survey_title').show();
				$('.active').show();	
			 }
			

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
		},
		'change .s_copy': function (event, template) {
     	 var surveyID_forCopy = $(event.currentTarget).val();
      		console.log("Title:" + surveyID_forCopy);
      		var survey_record = surveys.findOne({_id:surveyID_forCopy});
      		for(var key in survey_record){
      			document.getElementById('copyof_surveytitle').value = survey_record['title'];
      			document.getElementById('copy_active').checked = survey_record['active'];
      		}
      	}

	}
);

var resetSurveyModal = function() {
	$('#newSurveyModal input[type=text]').val('');
	$('#newSurveyModal input[type=checkbox]' ).attr('checked', false);
	$('#newSurveyModal input[type=checkbox]' ).prop('checked', false);
	$('.isCopyTrue' ).hide();
	$('.copyof_surveytitle').hide();
	$('.copy_active').hide();
	$('.survey_title').show();
	$('.active').show();
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
	if((document.getElementById('q_dataType').value=="Multiple Select")||(document.getElementById('q_dataType').value=="Single Select")){
			$( '#options').attr('disabled', status);
	}
};

var maxRank = function(survey_id){

	var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");

	if(surveyQuestionsMasterCollection.find({surveyID:survey_id}).count()<=0){
		return 0;
	} else {
		var order = surveyQuestionsMasterCollection.find({surveyID:survey_id},{sort: {order: -1}}).fetch();
		var maxOrder = 0;
		for(var i in order){
			maxOrder = order[i].order + 1;
		}
		return maxOrder;
	}
}

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
			var copy = survey.copy;

			$('.copy').hide();
			$('.copylabel').hide();
			$('.isCopyTrue' ).hide();

			if(copy){
				$('.copyof_surveytitle').show();
				$('.copy_active').show();
				$('.survey_title').hide();
				$('.active').hide();
			}else{
				$('.copyof_surveytitle').hide();
				$('.copy_active').hide();
				$('.survey_title').show();
				$('.active').show();
			}

			alert("Copy: " + copy + "Title: " + survey.title + "Active: " + survey.active);
			if(copy){
			$('#newSurveyModal input[type=text]#copyof_surveytitle').val(survey.title);
			$('#newSurveyModal input[type=checkbox]#copy_active' ).attr('checked', survey.active);
			$('#newSurveyModal input[type=checkbox]#copy_active' ).prop('checked', survey.active);
			}
			else{
			$('#newSurveyModal input[type=text]#survey_title').val(survey.title);
			$('#newSurveyModal input[type=checkbox]#active' ).attr('checked', survey.active);
			$('#newSurveyModal input[type=checkbox]#active' ).prop('checked', survey.active);
			$('#newSurveyModal input[type=checkbox]#skip' ).attr('checked', survey.skip);
			$('#newSurveyModal input[type=checkbox]#skip' ).prop('checked', survey.skip);
			$('#newSurveyModal input[type=checkbox]#copy' ).attr('checked', survey.copy);
			$('#newSurveyModal input[type=checkbox]#copy' ).prop('checked', survey.copy);
			}
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
			setFields(false);
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
				if(value!=null){
				var question2 = questions.findOne({_id:value});
				for(var key in question2){
					$('#q_category').val(question2.category).change();
					$('#q_name' ).val(question2.name);
					$('#question' ).val(question2.question);
					$('#q_dataType' ).val(question2.dataType ).change();
					if((document.getElementById('q_dataType').value=="Multiple Select")||(document.getElementById('q_dataType').value=="Single Select")){
						$( '#options,#options_label' ).removeClass('hide');
						$('#options' ).val(question2.options );
					}
					$('#newQuestionModal input[type=checkbox]#hud' ).attr('checked', question2.hud);
					$('#newQuestionModal input[type=checkbox]#hud' ).prop('checked', question2.hud);
					

				}
			}


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

			var options,selectstatus=false;

			if((q_dataType=="Multiple Select")||(q_dataType=="Single Select")){
				options = tmpl.find('#options').value;
				selectstatus=true;
			}
			else
				options="";
			if(q_category==""){
				$('#error').html("<b>Please select a question category</b>");
				$('#error').show();
			}else if(q_name==""){
				$('#error').html("<b>Please enter a questions name</b>");
				$('#error').show();
			}else if(question==""){
				$('#error').html("<b>Please enter a display text</b>");
				$('#error').show();
			}else if(q_dataType==""){
				$('#error').html("<b>Please select a datatype</b>");
				$('#error').show();
			}else if((selectstatus)&&(options=="")){
				$('#error').html("<b>Please enter options separated by commas </b>");
				$('#error').show();				
			}else{		
				$('#newQuestionModal').modal('hide');
				$('#error').hide();
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
		}
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
			if(question.locked)
				setFields(true);
			else
				setFields(false);
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

Template.surveyEditTemplate.events(
	{
		'click .addSection':function(event,tmpl){

			var survey_title = tmpl.data.title;
			var survey_id = tmpl.data._id;
			var content = tmpl.find('.sectionName').value;
			var content_type= "section";

			Meteor.call("addSurveyQuestionMaster", survey_title,survey_id,content_type,content,maxRank(survey_id), function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );

			$("#sectionName").val("");

		},
		'click .addLabel':function(event,tmpl){

			var survey_title = tmpl.data.title;
			var survey_id = tmpl.data._id;
			var content = tmpl.find('.labelName').value;
			var content_type= "label";

			Meteor.call("addSurveyQuestionMaster", survey_title,survey_id,content_type,content,maxRank(survey_id), function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );

			$("#labelName").val("");
		},

		'submit form':function(event,tmpl){
			event.preventDefault();
		},
	}
);

Template.sortableItemTarget.events(
	{
		'dblclick .name': function (event, template) {
			// Make the name editable. We should use an existing component, but it's
			// in a sorry state - https://github.com/arillo/meteor-x-editable/issues/1
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			var cont = surveyQuestionsMasterCollection.find({_id:this._id},{content_type:1,_id:0}).fetch();
			var contentType = '';
			for(var i in cont){
				var contentType = cont[i].content_type
			}
			if(contentType == "question"){
				alert("Question cannot be edited");
				input.hide();
				template.$('.name').show();
			}else{
				var name = template.$('.name');
				var input = template.$('input');
				if (input.length) {  // jQuery never returns null - http://stackoverflow.com/questions/920236/how-can-i-detect-if-a-selector-returns-null
					input.show();
				} else {
					input = $('<input class="form-control" type="text" placeholder="' + this.content + '" style="display: inline">');
					name.after(input);
				}
				name.hide();
				input.focus();
			}
		},
		'blur input[type=text]': function (event, template) {
			// var cont = SurveyQuestionsSchema.find({_id:this._id},{content_type:1,_id:0}).fetch();
			//   for(var i in cont){
			//         var contentType = cont[i].content_type
			//       }
			//   if(contentType == "question"){
			//     alert("Question cannot be edited");
			//     input.hide();
			//      template.$('.name').show();
			//   }
			// commit the change to the name, if any
			var input = template.$('input');
			input.hide();
			template.$('.name').show();
			// TODO - what is the collection here? We'll hard-code for now.
			// https://github.com/meteor/meteor/issues/3303
			if (this.name !== input.val() && this.name !== ''){
				//   var cont = SurveyQuestionsSchema.find({_id:this._id},{content_type:1,_id:0}).fetch();
				//   for(var i in cont){
				//         var contentType = cont[i].content_type
				//       }
				//   if(contentType == "question"){
				//     alert("Question cannot be edited");
				//   }else{

				Meteor.call("updateSurveyQuestionMaster", this._id, input.val(), function ( error, result ) {
					if ( error ) {
						console.log(error);
					} else {
						console.log(result);
					}
				} );

			}
		},
		'keydown input[type=text]': function (event, template) {
			if (event.which === 27) {
				// ESC - discard edits and keep existing value
				template.$('input').val(this.name);
				event.preventDefault();
				event.target.blur();
			} else if (event.which === 13) {
				// ENTER
				event.preventDefault();
				event.target.blur();
			}
		},
		'click .close': function (event, template) {
			// `this` is the data context set by the enclosing block helper (#each, here)

			Meteor.call("removeSurveyQuestionMaster", this._id, function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );

			// custom code, working on a specific collection
			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			if (surveyQuestionsMasterCollection.find({}).count() === 0) {
				Meteor.setTimeout(function () {
					alert('Not nice to delete the entire list! Add some attributes instead.');
				}, 1000);
			}
		}
	}
);

Template.selectQuestions.events(
	{
		'click .selectques':function(evt,tmpl){
			evt.preventDefault();

			var selected = tmpl.findAll( "input[type=checkbox]:checked");
			var array = selected.map(function(item){ return item.value})
			Session.set('selectedQuestions',array);
			var survey_id = tmpl.data._id;
			var survey_title = tmpl.data.title;
			var arrayLength = array.length;
			for (var i = 0; i < arrayLength; i++) {
				array[i] = array[i].substring(0, array[i].length - 1);
			}

			for(var i =0;i<array.length;i++){
				Meteor.call("addSurveyQuestionMaster", survey_title, survey_id, 'question', array[i], maxRank(survey_id), function ( error, result ) {
					if ( error ) {
						console.log(error);
					} else {
						console.log(result);
					}
				} );
			}

			Router.go('adminDashboardsurveysEdit', {_id:tmpl.data._id});
		}
	}
);

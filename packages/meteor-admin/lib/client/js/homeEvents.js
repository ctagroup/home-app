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

			var date_created,date_updated;
			var title = tmpl.find('.survey_title').value;
			// if(Session.get('editing_surveys')){
			//     date_updated = new Date();
			// }else{
			//     date_created = new Date();
			//     date_updated = new Date();
			// }
			// var subSurvey = tmpl.find('.sub_survey').checked;
			// var fullSurvey = tmpl.find('.full_survey').checked;
			var active = tmpl.find('.active').checked;
			var skip = tmpl.find('.skip').checked;
			var copy = tmpl.find('.copy').checked;
			//alert(title + " " +subSurvey + " " +fullSurvey + " " + active + " " + skip + " " + copy );

			if(Session.get('editing_surveys')){
				updateSurvey(title,active, skip, copy);
			}else {
				addSurvey(title,active, skip, copy);
			}
			Session.set('editing_surveys',null);

		},
		'click .cancel':function(evt,tmpl){
			Session.set('editing_surveys',null);

		},
		'click .remove':function(evt,tmpl){
			removeSurvey();
			Session.set('editing_surveys',null);

		}

	}
);

Template.surveyViewTemplate.events(
	{

		'click .addSurvey':function(evt,tmpl){

		}
	}
);
Template.surveyRow.events(
	{

		'click .edit':function(evt,tmpl){
			Session.set('editing_surveys', tmpl.data._id);

		}
		//'dblclick .surveyRow':function(evt,tmpl) {
		//    Session.set('editing_surveys', tmpl.data._id);
		//    Session.set('showSurveyDialog', true);
		//
		//    //var res = SurveysSchema.find({_id:tmpl.data._id}, {sub_survey: 1}).fetch();
		//    //for (var i = 0; i < res.length; i++) {
		//    //    if(res[i].sub_survey == true){
		//    //        alert("value is true");
		//    //       // $("#sub_survey").checked(true);
		//    //
		//    //    }
		//    //
		//    //    else{
		//    //        alert("value is false");
		//    //       // $("#sub_survey").is(false);
		//    //    }
		//    //}
		//
		//}
	}
);

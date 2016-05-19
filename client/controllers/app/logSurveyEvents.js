/**
 * Created by Anush-PC on 5/13/2016.
 */
Template.LogSurvey.events({
	'click .nextLogSurvey':function(evt,tmpl){
		var surveyID=tmpl.find('.surveyList').value;
		var clientID=tmpl.find('.clientList').value;
		Router.go('LogSurveyResponse', {_id:surveyID},{query: 'clientID='+clientID});
	}
});
var sec_id;
Template.LogSurveyResponse.events({
	'change .hideWhenSkipped':function (evt,tmpl) {

		var toggleSkip = $('.hideWhenSkipped').is(':checked');
		if(toggleSkip){

			var surveyQuestionsMasterCollection = adminCollectionObject("surveyQuestionsMaster");
			var masterSectionID = surveyQuestionsMasterCollection.findOne({_id:this._id},{allowSkip:1,_id:0});
			var masterSkip_val = masterSectionID.allowSkip;

			var skipValForSection = surveyQuestionsMasterCollection.find({sectionID:this._id}).fetch();
			for(var i in skipValForSection){

				sec_id = skipValForSection[i].sectionID;

			}
			console.log("masterSkip_val: " + masterSkip_val);
			if(masterSkip_val == "true" ){

				$('.' + sec_id).hide();
			}
		}else{
			$('.' + sec_id).show();
		}
	},
	'change .singleSelect':function (evt,tmpl) {

		var element = tmpl.find('input:radio[name=singleSelect]:checked');
		var optionValue = $(element).val();
		console.log("value: " + optionValue);

		if(optionValue == 'others' || optionValue == 'Others'){
			console.log("Others, please specify");
			$('.othersSpecify_single').removeClass('hide');
		}else{
			$('.othersSpecify_single').addClass('hide');
		}
	},
	'change .multipleSelect':function (evt,tmpl) {

		var element = tmpl.find('input:checkbox[name=multipleSelect]:checked');
		var optionValue = $(element).val();
		console.log("value: " + optionValue);

		if(optionValue == 'others' || optionValue == 'Others'){
			console.log("Others, please specify");
			$('.othersSpecify_multiple').removeClass('hide');
		}else{
			$('.othersSpecify_multiple').addClass('hide');
		}
	},
	'click .save_survey':function(evt,tmpl){

		alert("save clicked: " + tmpl.data._id );


	}
});

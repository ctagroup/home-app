SurveysSchema = new Meteor.Collection('surveysSchema');
if (Meteor.isClient) {

    Session.setDefault('appName','Survey Management')
    Session.setDefault('showSurveyDialog',false);
    Session.setDefault('editing_surveys',null)
    Template.registerHelper('formatDate', function(date) {
        return moment(new Date()).format('MM/DD/YYYY');
    });
    Template.menu.appName = function(){
        return Session.get('appName');
    }
    Template.surveyManager.surveyList = function(){
        return SurveysSchema.find();
    }
    //Template.surveyForm.onCreated(function(){
    //    var state = new ReactiveDict("surveyManager");
    //    this.state = state;
    //
    //});
    Template.surveyForm.events({

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
            Session.set('showSurveyDialog',false);
            Session.set('editing_surveys',null);

        },
        'click .cancel':function(evt,tmpl){
            Session.set('showSurveyDialog',false);
            Session.set('editing_surveys',null);

        },
        'click .remove':function(evt,tmpl){
            removeSurvey();
            Session.set('showSurveyDialog',false);
            Session.set('editing_surveys',null);

        }

    })

    Template.surveyManager.events({

        'click .addSurvey':function(evt,tmpl){
            Session.set('showSurveyDialog',true);
        }
    })
    Template.surveyRow.events({

        'click .edit':function(evt,tmpl){
            Session.set('editing_surveys', tmpl.data._id);
            Session.set('showSurveyDialog', true);

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
    })

    Template.surveyForm.surveyManager = function(){
        return SurveysSchema.findOne({_id:Session.get('editing_surveys')});
    }
    Template.surveyForm.editing_surveys = function(){
        return Session.get('editing_surveys');
    }
    Template.surveyManager.showSurveyDialog = function(){
        return Session.get('showSurveyDialog');
    }
    var addSurvey = function(title,active,skip,copy){
        var creation_date=moment(new Date()).format('MM-DD-YYYY');
        var updated_date=moment(new Date()).format('MM-DD-YYYY');
        SurveysSchema.insert({survey_title:title,date_created:creation_date,date_update:updated_date,active:active,skip:skip,copy:copy});
    }
    var updateSurvey = function(title,active,skip,copy){
         var updated_date=moment(new Date()).format('MM-DD-YYYY');
        SurveysSchema.update(Session.get('editing_surveys'), {$set: {survey_title:title,date_update:updated_date,active:active,skip:skip,copy:copy}});
        return true;
    }
    var removeSurvey = function(){
        SurveysSchema.remove({_id:Session.get('editing_surveys')});
    }
}


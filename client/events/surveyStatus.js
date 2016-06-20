/**
 * Created by Kavi on 5/19/16.
 */
Template.surveyStatusRow.events({

    'click .survey_route': function (evt,tmpl) {
        
        var response_id = tmpl.data._id;
        var responseCollection = adminCollectionObject("responses");
        var response_records = responseCollection.find({_id:response_id}).fetch();

        for(var i in response_records){
            
            var id = response_records[i]._id;
            Router.go('LogSurveyView', {_id: id});
            
        }

    }

});
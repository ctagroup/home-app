/**
 * Created by Kavi on 5/19/16.
 */
Template.surveyStatusRow.events({

    'click .survey_route': function (evt,tmpl) {
        
        var response_id = tmpl.data._id;
        var responseCollection = adminCollectionObject("responses");
        var response_records = responseCollection.find({_id:response_id}).fetch();

        for(var i in response_records){

            var surveyID = response_records[i].surveyID;
            var clientID = response_records[i].clientID;
            var responsestatus = response_records[i].responsestatus;
            console.log("SID: " + surveyID);
            console.log("CID: " + clientID);
            
            if(responsestatus=="Completed") {
                Router.go('LogSurveyView', {_id: surveyID}, {query: 'clientID=' + clientID});
            }else{
                Router.go('LogSurveyResponse', {_id: surveyID}, {query: 'clientID=' + clientID});
            }
        }

    }

});
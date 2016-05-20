/**
 * Created by Kavi on 5/19/16.
 */
Template.surveyStatus.helpers(
    {
        surveyStatusList: function() {
            var surveyStatusCollection = adminCollectionObject("responses");
            return surveyStatusCollection.find({}).fetch();
        }

    }
);
Template.surveyStatusRow.helpers({

    surveyName: function(surveyID){
        var surveyCollection = adminCollectionObject("surveys");
        var survey_Name = surveyCollection.find({_id:surveyID}).fetch();

        for(var i in survey_Name){

            var survey_name = survey_Name[i].title;
        }
        return survey_name;
    },
    clientName: function(clientID){
        var clientInfoCollection = adminCollectionObject("clientInfo");
        var client_name = clientInfoCollection.find({_id:clientID}).fetch();

        for(var i in client_name){

            var client_firstName = client_name[i].firstName;
            var client_middleName = client_name[i].middleName;
            var client_lastName = client_name[i].lastName;
        }
        return client_firstName + " " + client_middleName + " " + client_lastName;
    },
    userName: function(userID){
        var userCollection = adminCollectionObject("users");
        var user_name = userCollection.find({_id:userID}).fetch();

        for(var i in user_name){

            var user_emails = user_name[i].emails;

            for(var j in user_emails){

                var uname = user_emails[j].address;
            }
        }
        return uname;
    }
});
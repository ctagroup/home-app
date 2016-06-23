/**
 * Created by Kavi on 5/19/16.
 */
Template.surveyStatus.helpers(
  {
    surveyStatusList() {
      const surveyStatusCollection = adminCollectionObject('responses');
      return surveyStatusCollection.find({}).fetch();
    },
  }
);

Template.surveyStatusRow.helpers(
  {
    surveyName(surveyID) {
      const surveyCollection = adminCollectionObject('surveys');
      const survey = surveyCollection.findOne({ _id: surveyID });
      return survey.title || '';
    },
    clientName(clientID) {
      const clientInfoCollection = adminCollectionObject('clientInfo');
      const client = clientInfoCollection.findOne({ _id: clientID });
      return `${client.firstName} ${client.middleName} ${client.lastName}` || '';
    },
    userName(userID) {
      const userCollection = adminCollectionObject('users');
      const user = userCollection.findOne({ _id: userID });
      return user.emails[0].address || '';
    },
  }
);

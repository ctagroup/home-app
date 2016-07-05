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

      let val = '';

      if (survey && survey.title) {
        val = survey.title;
      }

      return val;
    },
    clientName(clientID) {
      const clientInfoCollection = adminCollectionObject('clientInfo');
      const client = clientInfoCollection.findOne({ _id: clientID });
      return `${client.firstName} ${client.middleName} ${client.lastName}` || '';
    },
    userName(userID) {
      const userCollection = adminCollectionObject('users');
      const user = userCollection.findOne({ _id: userID });

      let val = '';

      if (user && user.emails && user.emails[0].address) {
        val = user.emails[0].address;
      }

      return val;
    },
  }
);

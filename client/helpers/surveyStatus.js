/**
 * Created by Kavi on 5/19/16.
 */
Template.surveyStatus.helpers(
  {
    surveyStatusList() {
      const surveyStatusCollection = HomeUtils.adminCollectionObject('responses');
      return surveyStatusCollection.find({}).fetch();
    },
  }
);

Template.surveyStatusRow.helpers(
  {
    surveyName(surveyID) {
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      const survey = surveyCollection.findOne({ _id: surveyID });

      let val = '';

      if (survey && survey.title) {
        val = survey.title;
      }

      return val;
    },
    clientName(clientID) {
      const client = clients.findOne({ _id: clientID });
      return `${client.firstName} ${client.middleName} ${client.lastName}` || '';
    },
    userName(userID) {
      const userCollection = HomeUtils.adminCollectionObject('users');
      const user = userCollection.findOne({ _id: userID });

      if (user && user.services && user.services.HMIS && user.services.HMIS.name) {
        return user.services.HMIS.name.trim();
      }

      if (user && user.services && user.services.HMIS
          && user.services.HMIS.firstName && user.services.HMIS.lastName) {
        return (
          `${user.services.HMIS.firstName.trim()} ${user.services.HMIS.lastName.trim()}`
        ).trim();
      }

      if (user && user.emails && user.emails[0].address) {
        return user.emails[0].address;
      }

      return '';
    },
    surveyRoute() {
      const responseID = this._id;
      const responseCollection = HomeUtils.adminCollectionObject('responses');
      const responseRecord = responseCollection.findOne({ _id: responseID });

      let url = '#';

      if (responseRecord) {
        url = Router.path('LogSurveyView', { _id: responseRecord._id });
      }

      return url;
    },
  }
);

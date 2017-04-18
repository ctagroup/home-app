/**
 * Created by Kavi on 4/9/16.
 */
import moment from 'moment';

let genderCategories;
let veteranStatus;
let ethnicityCategories;
let raceCategories;
let disablingCond;

function getUniversalElements() {
  const questionsCollection = HomeUtils.adminCollectionObject('questions');
  const universalElements = questionsCollection.find(
    { category: 'Universal Data Elements' }
  ).fetch();

  for (let i = 0; i < universalElements.length; i += 1) {
    const qName = universalElements[i].name;

    switch (qName) {
      case 'gender':
        genderCategories = universalElements[i].options;
        break;
      case 'veteranStatus':
        veteranStatus = universalElements[i].options;
        break;
      case 'ethnicity':
        ethnicityCategories = universalElements[i].options;
        break;
      case 'race':
        raceCategories = universalElements[i].options;
        break;
      case 'disablingCond':
        disablingCond = universalElements[i].options;
        break;
      default:
        break;
    }
  }
}

Template.viewClient.onCreated(() => {
});

Template.viewClient.helpers(
  {
    isReferralStatusActive(step) {
      const client = Router.current().data();

      if (client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        if (step <= lastStatus.status) {
          return 'active';
        }
      } else if (client.matchingScore && step <= 0) {
        return 'active';
      }
      return '';
    },
    isReferralStatusActiveButton(step) {
      const client = Router.current().data();

      if (client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        if (step <= lastStatus.status) {
          return `btn-${HomeConfig.collections.clients.referralStatus[step].cssClass}`;
        }
      } else if (client.matchingScore && step <= 0) {
        return `btn-${HomeConfig.collections.clients.referralStatus[step].cssClass}`;
      }
      return 'btn-default';
    },
    getProgressbarActiveStatus() {
      const client = Router.current().data();
      if (client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        const cssClass = HomeConfig.collections.clients.referralStatus[lastStatus.status].cssClass;
        return `progress-bar-${cssClass}`;
      } else if (client.matchingScore) {
        const cssClass = HomeConfig.collections.clients.referralStatus[0].cssClass;
        return `progress-bar-${cssClass}`;
      }
      return 'progress-bar-default';
    },
    getProgressbarWidth() {
      const client = Router.current().data();
      if (client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        const total = HomeConfig.collections.clients.referralStatus.length;
        return `width: ${((lastStatus.status + 1) / total) * 100}%`;
      } else if (client.matchingScore) {
        const total = HomeConfig.collections.clients.referralStatus.length;
        return `width: ${(1 / total) * 100}%`;
      }
      return 'width: 0%;';
    },
    getCurrentReferralStatus() {
      const client = Router.current().data();
      if (client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        return lastStatus.status + 1;
      } else if (client.matchingScore) {
        return 1;
      }
      return 0;
    },
    getStatusTooltip(step) {
      const client = Router.current().data();
      let history = HomeConfig.collections.clients.referralStatus[step].desc;
      for (let i = 0; i < client.referralStatusHistory.length; i += 1) {
        if (client.referralStatusHistory[i].status === step) {
          let txt = client.referralStatusHistory[i].statusDescription;
          if (client.referralStatusHistory[i].comments) {
            txt = client.referralStatusHistory[i].comments;
          }
          history = `${history}<br />${client.referralStatusHistory[i].dateUpdated} - ${txt}`;
        }
      }
      return history;
    },
    showReferralStatus() {
      return Roles.userIsInRole(Meteor.user(), ['System Admin', 'Developer', 'Case Manager'])
        && Router.current().data().clientId && Router.current().params.query.isHMISClient;
    },
    showGlobalHousehold() {
      return Roles.userIsInRole(
        Meteor.user(), ['System Admin', 'Developer', 'Case Manager', 'Surveyor']
      ) && Router.current().data().clientId && Router.current().params.query.isHMISClient;
    },
    alertMessages() {
      const params = Router.current().params;

      let message = '';

      if (params && params.query && params.query.updated) {
        message = "<p class='notice bg-success text-success'>Client is updated successfully.</p>";
      } else if (params && params.query && params.query.addedToHMIS) {
        /* eslint-disable */
        message = "<p class='notice bg-success text-success'>Client is added to HMIS successfully.</p>";
        /* eslint-enable */
      } else if (params && params.query && params.query.addClientToHMISError) {
        /* eslint-disable */
        message = "<p class='notice bg-danger text-danger'>Something went wrong while adding the client to HMIS. Please contact the administrator.</p>";
        /* eslint-enable */
      }

      return message;
    },
    getText(text, code) {
      let definition = code;
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      const question = questionCollection.findOne({ name: text });
      if (question && question.options) {
        for (let j = 0; j < question.options.length; j += 1) {
          if (parseInt(question.options[j].value, 10) === parseInt(code, 10)) {
            definition = question.options[j].description;
            break;
          }
        }
        return definition;
      }
      if (text === 'race') {
        switch (code) {
          case 1:
          case '1': return 'American Indian or Alaska Native';
          case 2:
          case '2': return 'Asian';
          case 3:
          case '3': return 'Black or African American';
          case 4:
          case '4': return 'Native Hawaiian or Other Pacific Islander';
          case 5:
          case '5': return 'White';
          default: return definition;
        }
      }
      if (text === 'ethnicity') {
        switch (code) {
          case 0:
          case '0': return 'Non-Hispanic/Non-Latino';
          case 1:
          case '1': return 'Hispanic/Latino';
          default: return definition;
        }
      }
      if (text === 'gender') {
        switch (code) {
          case 0:
          case '0': return 'Female';
          case 1:
          case '1': return 'Male';
          case 2:
          case '2': return 'Transgender male to female';
          case 3:
          case '3': return 'Transgender female to male';
          case 4:
          case '4': return 'Other';
          default: return definition;
        }
      }
      /* eslint-disable */
      if (text === 'veteranStatus' || text === 'disablingcondition') {
        switch (code) {
          case 0:
          case '0': return 'No';
          case 1:
          case '1': return 'Yes';
          default: return definition;
        }
      }
      return definition;
    },
  }
);


Template.clientForm.helpers(
  {
    getUniversalElements() {
      getUniversalElements();
    },
    getFirstName() {
      let firstName = '';

      if (this && this.firstName) {
        firstName = this.firstName;
      } else if (Router.current().params.query && Router.current().params.query.firstName) {
        firstName = Router.current().params.query.firstName;
      }

      return firstName;
    },
    getDOB() {
      let date = '';
      if (this && this.dob) {
        date = moment.utc(this.dob).format('YYYY-MM-DD');
      }

      return date;
    },
    selected(item) {
      return this.value == item;
    },
    getDefaultRace() {
      return [
        {
          value: '1',
          description: 'American Indian or Alaska Native',
        }, {
          value: '2',
          description: 'Asian',
        }, {
          value: '3',
          description: 'Black or African American',
        }, {
          value: '4',
          description: 'Native Hawaiian or Other Pacific Islander',
        }, {
          value: '5',
          description: 'White',
        },
      ];
    },
    getExtraRace() {
      return raceCategories;
    },
    getDefaultEthnicity() {
      return [
        {
          value: '0',
          description: 'Non-Hispanic/Non-Latino',
        }, {
          value: '1',
          description: 'Hispanic/Latino',
        },
      ];
    },
    getExtraEthnicity() {
      return ethnicityCategories;
    },
    getDefaultGender() {
      return [
        {
          value: '0',
          description: 'Female',
        }, {
          value: '1',
          description: 'Male',
        }, {
          value: '2',
          description: 'Transgender male to female',
        }, {
          value: '3',
          description: 'Transgender female to male',
        }, {
          value: '4',
          description: 'Other',
        },
      ];
    },
    getExtraGender() {
      return genderCategories;
    },
    getDefaultVeteranStatus() {
      return [
        {
          value: '0',
          description: 'No',
        }, {
          value: '1',
          description: 'Yes',
        },
      ];
    },
    getExtraVeteranStatusOptions() {
      return veteranStatus;
    },
    getDefaultDisablingCondition() {
      return [
        {
          value: '0',
          description: 'No',
        }, {
          value: '1',
          description: 'Yes',
        },
      ];
    },
    getExtraDisablingCondition() {
      return disablingCond;
    },
    skipReleaseOfInformation() {
      const releaseOfInformationSkip = options.findOne(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.skip' }
      );

      let flag = false;

      if (releaseOfInformationSkip && releaseOfInformationSkip.option_value) {
        flag = true;
      }

      return flag;
    },
  }
);

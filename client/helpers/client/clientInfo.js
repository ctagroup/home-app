/**
 * Created by Kavi on 4/9/16.
 */
let genderCategories;
let veteranStatus;
let ethnicityCategories;
let raceCategories;
let residencePrior;
let destinationCategory;
let relationshipCategories;
let timesHomeless;
let disablingCond;

function getUniversalElements() {
  const questionsCollection = HomeUtils.adminCollectionObject('questions');
  const universalElements = questionsCollection.find(
    { category: 'Universal Data Elements' }
  ).fetch();

  for (let i = 0; i < universalElements.length; i++) {
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
      case 'residencePrior_to_entry':
        residencePrior = universalElements[i].options;
        break;
      case 'destination':
        destinationCategory = universalElements[i].options;
        break;
      case 'relationshiptohoh':
        relationshipCategories = universalElements[i].options;
        break;
      case 'timesHomelesspastthreeyears':
        timesHomeless = universalElements[i].options;
        break;
      case 'disablingCond':
        disablingCond = universalElements[i].options;
        break;
      default:
        break;
    }
  }
}

Template.viewClient.helpers(
  {
    isReferralStatusActive(step) {
      if (step == '1') {
        return 'active';
      }
      return '';
    },
    isReferralStatusActiveButton(step) {
      if (step == '1') {
        return HomeConfig.collections.clients.referralStatus[parseInt(step)].btnClass;
      }
      return 'btn-default';
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
        for (let j = 0; j < question.options.length; j++) {
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
      if (text === 'veteranStatus' || text === 'disablingcondition' || text === 'entryfromstreetessh') {
        switch (code) {
          case 0:
          case '0': return 'No';
          case 1:
          case '1': return 'Yes';
          default: return definition;
        }
      }
      if (text === 'otherresidenceprior') {
        switch (code) {
          case 1:
          case '1': return 'Emergency shelter, including hotel or motel paid for with emergency shelter';
          /* eslint-enable */
          case 2:
          case '2': return 'Transitional housing for homeless persons (including homeless youth)';
          case 3:
          case '3': return 'Permanent housing for formerly homeless persons';
          case 4:
          case '4': return 'Psychiatric hospital or other psychiatric facility    ';
          case 5:
          case '5': return 'Substance abuse treatment facility or detox center';
          case 6:
          case '6': return 'Hospital or other residential non-psychiatric medical facility';
          case 7:
          case '7': return 'Jail, prison or juvenile detention facility';
          case 12:
          case '12': return 'Staying or living in a family member’s room, apartment or house';
          case 13:
          case '13': return 'Staying or living in a friend’s room, apartment or house';
          case 14:
          case '14': return 'Hotel or motel paid for without emergency shelter voucher';
          case 15:
          case '15': return 'Foster care home or foster care group home';
          case 16:
          case '16': return 'Place not meant for habitation';
          case 18:
          case '18': return 'Safe Haven';
          case 19:
          case '19': return 'Rental by client, with VASH subsidy';
          case 20:
          case '20': return 'Rental by client, with other ongoing housing subsidy';
          case 21:
          case '21': return 'Owned by client, with ongoing housing subsidy';
          case 22:
          case '22': return 'Rental by client, no ongoing housing subsidy';
          case 23:
          case '23': return 'Owned by client, no ongoing housing subsidy';
          case 24:
          case '24': return 'Long-term care facility or nursing home';
          case 25:
          case '25': return 'Rental by client, with GPD TIP subsidy';
          case 26:
          case '26': return 'Residential project or halfway house with no homeless criteria';
          default: return definition;
        }
      }
      if (text === 'relationshiptohoh') {
        switch (code) {
          case 1:
          case '1': return 'Self';
          case 2:
          case '2': return 'Head of household’s child';
          case 3:
          case '3': return 'Head of household’s spouse or partner';
          case 4:
          /* eslint-disable */
          case '4': return 'Head of household’s other relation member (other relation to head of household)';
          /* eslint-enable */
          case 5:
          case '5': return 'Other: non-relation member';
          default: return definition;
        }
      }
      if (text === 'destination') {
        switch (code) {
          /* eslint-disable */
          case 1:
          case '1': return 'Emergency shelter, including hotel or motel paid for with emergency shelter';
          case 2:
          case '2': return 'Transitional housing for homeless persons (including homeless youth)';
          /* eslint-enable */
          case 3:
          case '3': return 'Permanent housing for formerly homeless persons';
          case 4:
          case '4': return 'Psychiatric hospital or other psychiatric facility';
          case 5:
          case '5': return 'Substance abuse treatment facility or detox center';
          case 6:
          case '6': return 'Hospital or other residential non-psychiatric medical facility';
          case 7:
          case '7': return 'Jail, prison or juvenile detention facility';
          case 10:
          case '10': return 'Rental by client, no ongoing housing subsidy';
          case 11:
          case '11': return 'Owned by client, no ongoing housing subsidy';
          case 12:
          case '12': return 'Staying or living with family, temporary tenure';
          case 13:
          case '13': return 'Staying or living with friends, temporary tenure';
          case 14:
          case '14': return 'Hotel or motel paid for without emergency shelter voucher';
          case 15:
          case '15': return 'Foster care home or foster care group home';
          case 16:
          case '16': return 'Place not meant for habitation';
          case 17:
          case '17': return 'Other';
          case 18:
          case '18': return 'Safe Haven';
          case 19:
          case '19': return 'Rental by client, with VASH subsidy';
          case 20:
          case '20': return 'Rental by client, with other ongoing housing subsidy';
          case 21:
          case '21': return 'Owned by client, with ongoing housing subsidy';
          case 22:
          case '22': return 'Staying or living with family, permanent tenure';
          case 23:
          case '23': return 'Staying or living with friends, permanent tenure';
          case 24:
          case '24': return 'Deceased';
          case 25:
          case '25': return 'Long-term care facility or nursing home';
          case 26:
          case '26': return 'Moved from one HOPWA funded project to HOPWA PH';
          case 27:
          case '27': return 'Moved from one HOPWA funded project to HOPWA TH';
          case 28:
          case '28': return 'Rental by client, with GPD TIP subsidy';
          case 29:
          case '29': return 'Residential project or halfway house with no homeless criteria';
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
        date = moment(this.dob).format('MM/DD/YYYY');
      }

      return date;
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
    getDefaultResidencePrior() {
      return [
        {
          value: '1',
          /* eslint-disable */
          description: 'Emergency shelter, including hotel or motel paid for with emergency shelter',
          /* eslint-enable */
        }, {
          value: '15',
          description: 'Foster care home or foster care group home',
        }, {
          value: '6',
          description: 'Hospital or other residential non-psychiatric medical facility',
        }, {
          value: '14',
          description: 'Hotel or motel paid for without emergency shelter voucher',
        }, {
          value: '7',
          description: 'Jail, prison or juvenile detention facility',
        }, {
          value: '24',
          description: 'Long-term care facility or nursing home',
        }, {
          value: '23',
          description: 'Owned by client, no ongoing housing subsidy',
        }, {
          value: '21',
          description: 'Owned by client, with ongoing housing subsidy',
        }, {
          value: '3',
          description: 'Permanent housing for formerly homeless persons',
        }, {
          value: '16',
          description: 'Place not meant for habitation',
        }, {
          value: '4',
          description: 'Psychiatric hospital or other psychiatric facility',
        }, {
          value: '22',
          description: 'Rental by client, no ongoing housing subsidy',
        }, {
          value: '19',
          description: 'Rental by client, with VASH subsidy',
        }, {
          value: '25',
          description: 'Rental by client, with GPD TIP subsidy',
        }, {
          value: '20',
          description: 'Rental by client, with other ongoing housing subsidy',
        }, {
          value: '26',
          description: 'Residential project or halfway house with no homeless criteria',
        }, {
          value: '18',
          description: 'Safe Haven',
        }, {
          value: '12',
          description: 'Staying or living in a family member’s room, apartment or house',
        }, {
          value: '13',
          description: 'Staying or living in a friend’s room, apartment or house',
        }, {
          value: '5',
          description: 'Substance abuse treatment facility or detox center',
        }, {
          value: '2',
          description: 'Transitional housing for homeless persons (including homeless youth)',
        }, {
          value: 'Other',
          description: 'Other',
        },
      ];
    },
    getExtraResidencePrior() {
      return residencePrior;
    },
    getEntryDate() {
      let date = '';

      if (this && this.entryDate) {
        date = moment(this.entryDate).format('MM/DD/YYYY');
      }

      return date;
    },
    getExitDate() {
      let date = '';

      if (this && this.exitDate) {
        date = moment(this.exitDate).format('MM/DD/YYYY');
      }

      return date;
    },
    getDefaultDestination() {
      return [
        {
          value: '24',
          description: 'Deceased',
        }, {
          value: '1',
          /* eslint-disable */
          description: 'Emergency shelter, including hotel or motel paid for with emergency shelter',
          /* eslint-enable */
        }, {
          value: '15',
          description: 'Foster care home or foster care group home',
        }, {
          value: '6',
          description: 'Hospital or other residential non-psychiatric medical facility',
        }, {
          value: '14',
          description: 'Hotel or motel paid for without emergency shelter voucher',
        }, {
          value: '7',
          description: 'Jail, prison or juvenile detention facility',
        }, {
          value: '25',
          description: 'Long-term care facility or nursing home',
        }, {
          value: '26',
          description: 'Moved from one HOPWA funded project to HOPWA PH',
        }, {
          value: '27',
          description: 'Moved from one HOPWA funded project to HOPWA TH',
        }, {
          value: '11',
          description: 'Owned by client, no ongoing housing subsidy',
        }, {
          value: '21',
          description: 'Owned by client, with ongoing housing subsidy',
        }, {
          value: '3',
          description: 'Permanent housing for formerly homeless persons',
        }, {
          value: '16',
          description: 'Place not meant for habitation',
        }, {
          value: '4',
          description: 'Psychiatric hospital or other psychiatric facility',
        }, {
          value: '10',
          description: 'Rental by client, no ongoing housing subsidy',
        }, {
          value: '19',
          description: 'Rental by client, with VASH subsidy',
        }, {
          value: '28',
          description: 'Rental by client, with GPD TIP subsidy',
        }, {
          value: '20',
          description: 'Rental by client, with other ongoing housing subsidy',
        }, {
          value: '29',
          description: 'Residential project or halfway house with no homeless criteria',
        }, {
          value: '18',
          description: 'Safe Haven',
        }, {
          value: '22',
          description: 'Staying or living with family, permanent tenure',
        }, {
          value: '12',
          description: 'Staying or living with family, temporary tenure',
        }, {
          value: '23',
          description: 'Staying or living with friends, permanent tenure',
        }, {
          value: '13',
          description: 'Staying or living with friends, temporary tenure',
        }, {
          value: '5',
          description: 'Substance abuse treatment facility or detox center',
        }, {
          value: '2',
          description: 'Transitional housing for homeless persons (including homeless youth)',
        }, {
          value: '17',
          description: 'Other',
        },
      ];
    },
    getExtraDestination() {
      return destinationCategory;
    },
    getDefaultRelationshipToHoh() {
      return [
        {
          value: '1',
          description: 'Self',
        }, {
          value: '2',
          description: 'Head of household’s child',
        }, {
          value: '3',
          description: 'Head of household’s spouse or partner',
        }, {
          value: '4',
          /* eslint-disable */
          description: 'Head of household’s other relation member (other relation to head of household)',
          /* eslint-enable */
        }, {
          value: '5',
          description: 'Other: non-relation member',
        },
      ];
    },
    getExtraRelationshipToHoh() {
      return relationshipCategories;
    },
    getDefaultTimesHomeless() {
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
    getExtraTimesHomeless() {
      return timesHomeless;
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

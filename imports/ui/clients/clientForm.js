import OpeningScript from '/imports/api/openingScript/openingScript';
import moment from 'moment';
import { logger } from '/imports/utils/logger';
import './clientForm.html';

let genderCategories;
let veteranStatus;
let ethnicityCategories;
let raceCategories;
let disablingCond;

function getUniversalElements() {
  /*

  // I commented it out because there were no questions in the DB that
  // could extend any of the select options

  // TODO: move to router??
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
  */
}

Template.clientForm.onRendered(() => {
  // to load the script on run time and then put the mask for ssn and PN
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.8/jquery.mask.js', () => {
    $('.ssn').mask('000-00-0000');
    $('.phoneNumber').mask('(000) 000-0000');
  });
});

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
      return this.value === item;
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
      return OpeningScript.skipReleaseOfInformation();
    },
  }
);


Template.clientForm.events(
  {
    'change #js-photo-input': () => {
      const file = document.querySelector('#js-photo-input').files[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        $('#client-photo-img').attr('src', reader.result);
        $('#client-photo-value').val(reader.result);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    'click #js-take-photo': (event) => {
      event.preventDefault();
      logger.info('clicked picture button');
      MeteorCamera.getPicture({}, (error, data) => {
        if (error) {
          logger.warn(error);
        } else {
          $('#client-photo-img').attr('src', data);
          $('#client-photo-value').val(data);
          $('#js-remove-photo').removeClass('hide');
        }
      });
    },
    'click #js-remove-photo': (event) => {
      event.preventDefault();
      logger.info('clicked remove picture button');
      $('#client-photo-img').attr('src', '');
      $('#client-photo-value').val('');
      $('#js-remove-photo').addClass('hide');
    },
  }
);

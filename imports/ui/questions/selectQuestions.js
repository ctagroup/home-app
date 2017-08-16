import { logger } from '/imports/utils/logger';
import { maxRank } from '/imports/ui/surveys/helpers';

// TODO: ????
Session.setDefault('selectedQuestions', null);

Template.selectQuestions.helpers(
  {
    questionList() {
      const questionCollection = HomeUtils.adminCollectionObject('questions');
      const surveysCollection = HomeUtils.adminCollectionObject('surveys');
      const survey = surveysCollection.findOne({ _id: Router.current().params._id });
      logger.log(`survey type=${survey.stype}`);
      logger.log(`survey id to select questions=${Router.current().params._id}`);
      if (survey.stype.match('spdat')) {
        return questionCollection.find({ qtype: 'spdat' }).fetch();
      }
      return questionCollection.find({ qtype: survey.stype }).fetch();
    },
  }
);


// TODO: ??? unused parameter
let skipVal;

Template.selectQuestions.events(
  {
    'click .selectques': (evt, tmpl) => {
      evt.preventDefault();

      const selected = tmpl.findAll('input[type=checkbox]:checked');
      const array = selected.map(item => item.value);
      Session.set('selectedQuestions', array);
      const surveyId = tmpl.data._id;
      const surveyingTitle = tmpl.data.title;
      const arrayLength = array.length;
      for (let i = 0; i < arrayLength; i += 1) {
        array[i] = array[i].substring(0, array[i].length - 1);
      }
      logger.log(`Ques: ${array}`);
      // get section's Id which is at the bottom.
      const surveyQuestionsMasterCollection = HomeUtils.adminCollectionObject(
        'surveyQuestionsMaster'
      );
      const lastSection = surveyQuestionsMasterCollection.findOne(
        { $and: [
          { surveyID: surveyId },
          { contentType: 'section' },
        ] },
        { sort: { order: -1 } }
      );
      let order = maxRank(surveyId, 'question');
      logger.log(`skip val: ${order}`);
      for (let i = 0; i < array.length; i += 1) {
        Meteor.call(
          'addSurveyQuestionMaster',
          surveyingTitle,
          surveyId,
          lastSection._id,
          skipVal,
          'question',
          array[i],
          order,
          (error, result) => {
            if (error) {
              logger.log(error);
            } else {
              logger.log(result);
            }
          }
        );
        order += 1;
      }

      Router.go('adminDashboardsurveysEdit', { _id: tmpl.data._id });
    },
  }
);

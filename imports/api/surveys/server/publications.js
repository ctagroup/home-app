import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import Responses from '/imports/api/responses/responses';
import { HmisClient } from '/imports/api/hmisApi';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';
import { updateDocFromDefinition } from '/imports/api/surveys/helpers';


Meteor.publish('surveys.all', function publishAllSurveys() {
  logger.info(`PUB[${this.userId}]: surveys.all`);

  const hc = HmisClient.create(this.userId);
  const surveys = hc.api('survey2').getSurveys();
  const localSurveys = Surveys.find({ version: 2 }).fetch();

  surveys.filter(s => !!s.surveyDefinition).forEach(s => {
    const doc = {
      version: 2,
      title: s.surveyTitle,
      definition: s.surveyDefinition,
      hmis: {
        surveyId: s.surveyId,
        status: 'uploaded',
      },
      numberOfResponses: Responses.find({ surveyId: s.surveyId }).count(),
      createdAt: '',
    };
    this.added('surveys', s.surveyId, updateDocFromDefinition(doc));
  });
  localSurveys.map(s => this.added('surveys', s._id, {
    ...s,
    hmis: {
      status: 'not uploaded',
    },
    numberOfResponses: Responses.find({ surveyId: s._id }).count(),
  }));
  this.ready();
});

Meteor.publish('surveys.one', function publishOneSurvey(_id) {
  logger.info(`PUB[${this.userId}]: surveys.one`, _id);
  if (Surveys.find({ _id, version: 2 }).count()) {
    return Surveys.find({ _id, version: 2 });
  }

  const hc = HmisClient.create(this.userId);
  const survey = hc.api('survey2').getSurvey(_id);

  this.added('surveys', survey.surveyId, updateDocFromDefinition({
    title: survey.surveyTitle,
    locked: survey.locked,
    definition: survey.surveyDefinition,
    version: 2,
    hmis: {
      surveyId: survey.surveyId,
      status: 'uploaded',
    },
  }));
  return this.ready();
});

Meteor.publish('surveys.v1', function publishAllSurveys() {
  logger.info(`PUB[${this.userId}]: surveys.v1`);
  return [
    Surveys.find({ version: 1 }),
    SurveyQuestionsMaster.find(),
  ];
});


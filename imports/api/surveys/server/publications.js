import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import Responses from '/imports/api/responses/responses';
import { HmisClient } from '/imports/api/hmisApi';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';
import { updateDocFromDefinition } from '/imports/api/surveys/helpers';
import eventPublisher, {
  SurveyUpdatedEvent,
} from '/imports/api/eventLog/events';


function loadSurvey(surveyId, userId) {
  const hc = HmisClient.create(userId);
  const survey = hc.api('survey2').getSurvey(surveyId);
  const doc = updateDocFromDefinition({
    title: survey.surveyTitle,
    locked: survey.locked,
    definition: survey.surveyDefinition,
    version: 2,
    hmis: {
      surveyId: survey.surveyId,
      status: 'uploaded',
    },
  });
  return doc;
}


Meteor.publish('surveys.all', function publishAllSurveys(/* params = {} */) {
  logger.info(`PUB[${this.userId}]: surveys.all`);

  const hc = HmisClient.create(this.userId);
  try {
    const surveys = hc.api('survey2').getSurveys() || [];
    const localSurveys = Surveys.find({ version: 2 }).fetch();

    surveys.filter(s => !!s.surveyDefinition).forEach(s => {
      this.added('surveys', s.surveyId, {
        version: 2,
        title: s.surveyTitle,
        definition: s.surveyDefinition,
        hmis: {
          surveyId: s.surveyId,
          status: 'uploaded',
        },
        numberOfResponses: Responses.find({ surveyId: s.surveyId }).count(),
        createdAt: '',
      });
    });
    localSurveys.map(s => this.added('surveys', s._id, {
      ...s,
      hmis: {
        status: 'not uploaded',
      },
      numberOfResponses: Responses.find({ surveyId: s._id }).count(),
    }));
  } catch (e) {
    logger.warn(e);
  }
  return this.ready();
});


Meteor.publish('surveys.one', function publishOneSurvey(_id) {
  logger.info(`PUB[${this.userId}]: surveys.one`, _id);
  if (Surveys.find({ _id, version: 2 }).count()) {
    return Surveys.find({ _id, version: 2 });
  }

  const doc = loadSurvey(_id, this.userId);
  this.added('surveys', _id, doc);

  const surveyUpdatedEvent = (event) => {
    if (event.surveyId === _id) {
      const changedDoc = loadSurvey(event.surveyId, this.userId);
      this.changed('surveys', event.surveyId, changedDoc);
    }
  };

  eventPublisher.addListener(SurveyUpdatedEvent, surveyUpdatedEvent);
  this.onStop(() => eventPublisher.removeListener(SurveyUpdatedEvent, surveyUpdatedEvent));

  return this.ready();
});

Meteor.publish('surveys.v1', function publishAllSurveys() {
  logger.info(`PUB[${this.userId}]: surveys.v1`);
  return [
    Surveys.find({ version: 1 }),
    SurveyQuestionsMaster.find(),
  ];
});


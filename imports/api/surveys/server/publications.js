import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import SurveyCaches from '/imports/api/surveys/surveyCaches';
import Responses from '/imports/api/responses/responses';
import { HmisClient } from '/imports/api/hmisApi';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';
import { updateDocFromDefinition } from '/imports/api/surveys/helpers';
import eventPublisher, {
  SurveyUpdatedEvent,
} from '/imports/api/eventLog/events';
import { ClientsAccessRoles } from '/imports/config/permissions';

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


// TODO [VK]: force reaload cache flag?
Meteor.publish('surveys.all', function publishAllSurveys(force = true) {
  logger.info(`PUB[${this.userId}]: surveys.all`);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }

  const hc = HmisClient.create(this.userId);
  try {
    const localSurveys = Surveys.find({ version: 2 }).fetch();
    const surveyCaches = SurveyCaches.find().fetch();
    const surveysList = [];
    if (surveyCaches.length && !force) {
      surveyCaches.forEach((survey) => {
        survey.numberOfResponses = Responses.find({ surveyId: survey.surveyId }).count(); // eslint-disable-line
        this.added('surveys', survey.surveyId, survey);
      });
    } else {
      const surveys = hc.api('survey2').getSurveys() || [];
      surveys.filter(s => !!s.surveyDefinition).forEach(s => {
        if (!s.surveyDefinition) return;
        const surveyData = updateDocFromDefinition({
          _id: s.surveyId,
          surveyId: s.surveyId,
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
        this.added('surveys', s.surveyId, surveyData);
        surveysList.push(surveyData);
      });
      SurveyCaches.rawCollection().insertMany(surveysList, { ordered: false });
    }
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
  check(_id, String);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }

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
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }
  return [
    Surveys.find({ version: 1 }),
    SurveyQuestionsMaster.find(),
  ];
});

import Alert from '/imports/ui/alert';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Surveys from '/imports/api/surveys/surveys';
import Survey from '/imports/ui/components/surveyForm/Survey';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import './enrollmentsNew.html';

Template.enrollmentsNew.onCreated(function onEnrollmentsNew() {
  this.surveyLoaded = new ReactiveVar(false);
  this.subscribe('surveys.all', () => this.surveyLoaded.set(true));
  /**
   * Creates v2017 schema client version if missing:
   */
  const requiredSchema = 'v2017';
  const client = this.data && this.data.client;
  if (client && client.clientVersions) {
    const { clientVersions } = client;
    if (! _.find(clientVersions, ({ schema }) => schema === requiredSchema)) {
      Meteor.callPromise('clients.create', client, requiredSchema, true)
      .then(
        ({ clientId, schema }) => ({
          id: clientId,
          schema,
          message: 'Client v2017 created in HMIS',
        }),
        err => {
          if (err.details && err.details.code === 400) throw new Error(err.reason);
          return {
            id: client._id,
            schema: client.schema,
            message: 'Failed to create v2017 client version',
          };
        }
      )
      .then(({ id, schema, message }) => {
        Alert.success(message);
        const query = schema ? { query: { schema } } : {};
        Router.go('viewClient', { _id: id }, query);
      })
      .catch(err => Alert.error(err));
    }
  }
});

Template.enrollmentsNew.helpers({
  client() {
    return this.client;
  },
  project() {
    console.log(this.project);
    return this.project;
  },
  surveyLoaded() {
    return Template.instance().surveyLoaded.get();
  },
  isEnrollment() {
    return true;
  },
  component() {
    return Survey;
  },
  definition() {
    if (!Template.instance().surveyLoaded.get()) return {};
    const survey = Surveys.findOne(this.surveyId);
    const definition = JSON.parse(survey.definition);
    return {
      ...definition,
      title: definition.title || survey.title,
    };
  },
  surveyId() {
    return this.surveyId;
  },
  enrollmentInfo() {
    return this.enrollmentInfo;
  },
  isAdmin() {
    return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
  },
});

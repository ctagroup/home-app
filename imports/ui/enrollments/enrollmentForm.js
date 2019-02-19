import Alert from '/imports/ui/alert';
import Enrollments from '/imports/api/enrollments/enrollments';
import './enrollmentForm.html';
import './selectEnrollmentSurveys.js';

Template.enrollmentForm.onRendered(function onEnrollmentFormRender() {
  /**
   * Creates v2017 schema client version if missing:
   */
  const requiredSchema = 'v2017';
  const client = this.client;
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

Template.enrollmentForm.helpers({
  doc() {
    if (!this.enrollment) return {};
    return this.enrollment;
  },

  schema() {
    if (this.step) {
      return {
        start: Enrollments.startSchema,
        update: Enrollments.updateSchema,
        quit: Enrollments.quitSchema,
      }[this.step];
    }
    return Enrollments.schema;
  },
});


AutoForm.hooks({
  enrollmentForm: {
    onSubmit: function onSubmit() {
      return false;
    },
  },
});

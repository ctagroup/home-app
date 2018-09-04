import { logger } from '/imports/utils/logger';
import { iterateItems } from '../surveys/computations';
import { unescapeKeys } from '/imports/api/utils';
import { translateString } from '/imports/both/helpers';


export class EnrollmentUploader {
  constructor(response, survey) {
    this.response = response;
    this.survey = survey;
  }

  getCreateUriTemplateFromUpdateUriTemplate(updateUriTemplate) {
    const parts = updateUriTemplate.split('/');
    const lastPart = parts.pop();
    if (lastPart.startsWith('{') && lastPart.endsWith('}')) {
      return parts.join('/');
    }
    return updateUriTemplate;
  }

  questionResponsesToData(projectId) {
    const { clientSchema } = this.response;
    const values = unescapeKeys(this.response.values);

    const data = {};
    const definition = JSON.parse(this.survey.surveyDefinition);
    iterateItems(definition, (item) => {
      const { enrollment } = item;

      if (!enrollment) return;

      const { uriObject, uriObjectField, updateUriTemplate } = enrollment;

      if (!updateUriTemplate || !uriObject || !uriObjectField) return;

      const uri = this.getCreateUriTemplateFromUpdateUriTemplate(updateUriTemplate);

      if (!data[uri]) {
        data[uri] = {};
      }
      if (!data[uri][uriObject]) {
        // provide required defaults to uriObjects
        switch (uriObject) {
          case 'enrollment':
            data[uri][uriObject] = {
              projectid: projectId,
            };
            break;
          default:
            data[uri][uriObject] = {};
        }
      }
      if (item.enrollment.schema === clientSchema) {
        data[uri][uriObject][uriObjectField] = values[item.id] || 99;
      } else {
        data[uri][uriObject][uriObjectField] = 99;
      }
    });
    return data;
  }

  dataOrderedByUrlVariables(data) {
    return Object.keys(data)
      .sort((a, b) => {
        // sort by number of variables in uri, they all start with {
        const lenA = (a.match(/\{/g) || []).length;
        const lebB = (b.match(/\{/g) || []).length;
        return lenA - lebB;
      })
      .reduce((all, key) => ({
        ...all,
        [key]: data[key],
      }), {});
  }

  upload(sortedData, clientApi) {
    const uriTemplateVariables = {
      '{clientid}': this.response.clientId,
    };

    logger.debug('uploading', sortedData, uriTemplateVariables);
    // todo: add existing variables

    const uriTemplates = Object.keys(sortedData);

    let uploadErrorDetails = null;

    const responses = uriTemplates.reduce((all, uriTemplate) => {
      const uri = translateString(uriTemplate, uriTemplateVariables);
      const data = sortedData[uriTemplate];
      const uriObject = Object.keys(data).shift();

      if (uploadErrorDetails) {
        // we have an error, skip other urls
        return all;
      }

      try {
        // send data
        const response = clientApi.postData(uri, data);

        // add object id to template variables to use in successive calls
        const uriObjectId = `${uriObject}Id`;
        const responseObjectId = response[uriObject][uriObjectId];
        uriTemplateVariables[`{${uriObjectId.toLowerCase()}}`] = responseObjectId;
        logger.debug('new vars', uriTemplateVariables);
        return {
          ...all,
          [uriObject]: {
            id: responseObjectId,
            deleteUri: `${uri}/${responseObjectId}`,
          },
        };
      } catch (err) {
        uploadErrorDetails = `An error occurred while uploading ${uriObject}: ${err}`;
        logger.warn('An error ocurred while uploading enrollment', err);
        return all;
      }
    }, {});

    if (uploadErrorDetails) {
      throw new Meteor.Error(500, uploadErrorDetails);
      // TODO: rollback, remove all data
    }

    return responses;
  }
}

// const getEnrollmentIds = (hc, clientId, schema) =>
//   hc.api('client').getClientEnrollments(clientId, schema)
//     .map(({ id }) => ({
//       enrollmentId: id,
//       clientId,
//       source: schema.slice(1),
//     }));

// export const getClientGlobalEnrollment = (hc, client) => {
//   const { dedupClientId, clientVersions } = client;
//   const globalEnrollments = hc.api('global').getClientEnrollments(dedupClientId);
//   if (globalEnrollments[0]) return globalEnrollments[0];

//   // Create enrollment if none:
//   let enrollments;
//   if (clientVersions) {
//     // Merged Client
//     enrollments = clientVersions
//       .map(({ clientId, schema }) => getEnrollmentIds(hc, clientId, schema))
//       .reduce((acc, val) => acc.concat(val), []); // flatten once
//   } else {
//     const { clientId, schema } = client;
//     enrollments = getEnrollmentIds(hc, clientId, schema);
//   }
//   const globalEnrollment = hc.api('global').createGlobalEnrollment(dedupClientId, enrollments);
//   return globalEnrollment;
// };

import { logger } from '/imports/utils/logger';
import { iterateItems } from '../surveys/computations';
import { unescapeKeys } from '/imports/api/utils';
import { translateString } from '/imports/both/helpers';


export class EnrollmentUploader {
  constructor(response, survey) {
    this.response = response;
    this.survey = survey;
  }

  getPostOrPutUri(uri) {
    // we are simply counting /{abcd} here
    // in the future, more complex regex may be required
    const regex = /\/\{.+?\}/g;
    const numberOfUnresolvedVariables = (uri.match(regex) || []).length;

    if (numberOfUnresolvedVariables === 0) {
      return {
        postUri: null,
        putUri: uri,
      };
    }

    if (numberOfUnresolvedVariables === 1) {
      // this is post request
      return {
        postUri: uri.replace(regex, ''),
        putUri: null,
      };
    }

    throw new Error(
      `Got ${numberOfUnresolvedVariables} unresolved variables in ${uri}. Expected 0 or 1`
    );
  }

  questionResponsesToData(projectId, dataCollectionStage) {
    const { clientSchema } = this.response;
    const values = unescapeKeys(this.response.values);

    const data = {};
    const definition = JSON.parse(this.survey.surveyDefinition);
    iterateItems(definition, ({ enrollment, id }) => {
      if (!enrollment) return;

      const { updateUriTemplate } = enrollment;
      const defaultObject = enrollment.defaultObject || {};
      let { uriObjectField } = enrollment;

      let uriObject = '';
      [uriObject, uriObjectField] = uriObjectField.split('.');

      if (!updateUriTemplate || !uriObject || !uriObjectField) return;

      const uri = updateUriTemplate;

      if (!data[uri]) {
        data[uri] = {};
      }
      if (!data[uri][uriObject]) {
        switch (uriObject) {
          case 'enrollment':
            data[uri][uriObject] = {
              ...defaultObject,
              projectId,
              entryDate: values.entryDate,
            };
            break;
          default:
            data[uri][uriObject] = {
              ...defaultObject,
              dataCollectionStage,
            };
        }
      }
      if (enrollment.schema === clientSchema) {
        data[uri][uriObject][uriObjectField] = values[id] || 99;
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

    const responseCount = {};

    const responses = uriTemplates.reduce((all, uriTemplate) => {
      const translated = translateString(uriTemplate, uriTemplateVariables);

      const { postUri, putUri } = this.getPostOrPutUri(translated);
      console.log('post/put', postUri, putUri);

      const data = sortedData[uriTemplate];
      const uriObject = Object.keys(data).shift();

      if (uploadErrorDetails) {
        // we have an error, skip other urls
        return all;
      }

      try {
        // send data
        const response = postUri ?
          clientApi.postData(postUri, data) : clientApi.putData(putUri, data);

        // add object id to template variables to use in successive calls
        const uriObjectId = `${uriObject}Id`;
        const responseKey = `${uriObject}-${responseCount[uriObject] || 0}`;
        responseCount[uriObject] = (responseCount[uriObject] || 0) + 1;
        const responseObjectId = response[uriObject][uriObjectId];
        uriTemplateVariables[`{${uriObjectId.toLowerCase()}}`] = responseObjectId;
        logger.debug('new vars', uriTemplateVariables);

        const baseUri = postUri.split('?')[0].split('#')[0];
        return postUri ? {
          ...all,
          [responseKey]: {
            id: responseObjectId,
            updateUri: `${baseUri}/${responseObjectId}`,
          },
        } : {
          ...all,
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

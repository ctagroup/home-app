import { logger } from '/imports/utils/logger';
import { iterateItems } from '../surveys/computations';
import { unescapeKeys } from '/imports/api/utils';
import { translateString } from '/imports/both/helpers';


export class EnrollmentUploader {
  constructor(response, survey) {
    this.response = response;
    this.survey = survey;
  }

  getMappingFromTemplatesToExistingUris() {
    if (this.response.enrollment) {
      const keys = Object.keys(this.response.enrollment);
      return keys.reduce((all, key) => {
        const entry = this.response.enrollment[key];
        if (entry.uriTemplate) {
          return {
            ...all,
            [entry.uriTemplate]: entry.updateUri,
          };
        }
        return all;
      }, {});
    }
    return {};
  }

  getPostUri(uri) {
    // we are simply counting /{abcd} here
    // in the future, more complex regex may be required
    const regex = /\/\{.+?\}/g;
    const numberOfUnresolvedVariables = (uri.match(regex) || []).length;

    if (numberOfUnresolvedVariables === 0) {
      return uri;
    }

    if (numberOfUnresolvedVariables === 1) {
      // this is post request
      return uri.replace(regex, '');
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

    try {
      if (this.response.enrollmentInfo.enrollmentId) {
        uriTemplateVariables['{enrollmentid}'] = this.response.enrollmentInfo.enrollmentId;
      }
    } catch (err) {
      // this must be new enrollment
    }

    logger.debug('uploading', sortedData, uriTemplateVariables);
    // todo: add existing variables

    const uriTemplates = Object.keys(sortedData);

    let uploadErrorDetails = null;

    const responseCount = {};
    const mappingForPutOps = this.getMappingFromTemplatesToExistingUris();

    const responses = uriTemplates.reduce((all, uriTemplate) => {
      let postUri;
      let putUri;

      if (mappingForPutOps[uriTemplate]) {
        // do PUT
        putUri = mappingForPutOps[uriTemplate];
      } else {
        // do POST
        const translated = translateString(uriTemplate, uriTemplateVariables);
        postUri = this.getPostUri(translated);
      }

      const data = sortedData[uriTemplate];
      const uriObject = Object.keys(data).shift();

      if (uploadErrorDetails) {
        // we have an error, skip other urls
        return all;
      }

      try {
        // send data
        if (putUri) {
          clientApi.putData(putUri, data);
          return all;
        }
        const response = clientApi.postData(postUri, data);

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
            uriTemplate,
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

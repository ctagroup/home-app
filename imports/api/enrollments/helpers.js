import _ from 'lodash';
import { itemsToArray } from '/imports/api/surveys/computations';


export function mapEnrollmentToSurveyInitialValues(enrollment, definition) {
  const enrollmentSurveyItems = itemsToArray(definition).filter(item => !!item.enrollment);

  return enrollmentSurveyItems.reduce((all, item) => {
    const path = item.enrollment.uriObjectField;
    const pathParts = path.split('.');
    let value;

    switch (pathParts[0]) {
      case 'disabilities':
        value = enrollment.disabilities
          .find(d => d.disabilityType == item.enrollment.defaultObject.disabilityType) || {}; // eslint-disable-line
        value = value[pathParts[1]];
        break;
      default:
        value = _.get(enrollment, path);
    }
    if (value === undefined) return all;
    if (typeof(value) === 'string') value = value.trim();
    return {
      ...all,
      [item.id]: value,
    };
  }, {});
}

export const getClientGlobalEnrollments = (hc, dedupClientId, stopFunction) => {
  console.log('stopFunction', stopFunction);
  const globalEnrollments = hc.api('global').getClientEnrollments(dedupClientId);
  return globalEnrollments;
};

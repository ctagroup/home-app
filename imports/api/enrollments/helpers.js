import _ from 'lodash';
import { itemsToArray } from '/imports/api/surveys/computations';

export function mapEnrollmentToSurveyInitialValues(enrollment, definition) {

  const data = {
    enrollment: {
      entryDate: '2018-11-20',
    },
    enrollmentCoc: {
      cocCode: 'CA-602',
    },
    disabilities: [
      {
        disabilityResponse: 1,
        indefiniteandImpairs: 1,
        disabilityType: 5,
      },
    ]
  }

  const enrollmentSurveyItems = itemsToArray(definition).filter(item => !!item.enrollment);
  console.log('mapEnrollmentToSurveyInitialValues ', enrollment, enrollmentSurveyItems);

  _.get()

  return {
    entryDate:	,
    'question-4':	,
    'question-21':	1,
    'question-21a':	1,
  };
}

export const getClientGlobalEnrollments = (hc, dedupClientId, stopFunction) => {
  console.log('stopFunction', stopFunction);
  const globalEnrollments = hc.api('global').getClientEnrollments(dedupClientId);
  return globalEnrollments;
};

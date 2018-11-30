/* eslint prefer-arrow-callback: "off", func-names: "off" */

// import nock from 'nock';
// import { HmisClient } from './hmisClient';
// import { ApiRegistry } from './apiRegistry';
import { chai } from 'meteor/practicalmeteor:chai';

import { mapEnrollmentToSurveyInitialValues } from './helpers';

const enrollmentSurveyDefinition = {
  items: [
    {
      id: 'question1',
      enrollment: {
        schema: 'v2017',
        uriObjectField: 'enrollment.entryDate',
      },
    },
    {
      id: 'disability-type5',
      enrollment: {
        schema: 'v2017',
        uriObjectField: 'disabilities.disabilityResponse',
        defaultObject: {
          disabilityType: 5,
        },
      },
    },
    {
      id: 'disability-typ6',
      enrollment: {
        schema: 'v2017',
        uriObjectField: 'disabilities.disabilityResponse',
        defaultObject: {
          disabilityType: 6,
        },
      },
    },
  ],
};

describe('enrollments helpers', function () {
  it.only('will map single value via mapEnrollmentToSurveyInitialValues', function () {
    const enrollmentData = {
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
      ],
    };

    const definition = {
      items: [
        {
          id: 'question1',
          enrollment: {
            schema: 'v2017',
            uriObjectField: 'enrollment.entryDate',
          },
        },
      ],
    };

    const actual = mapEnrollmentToSurveyInitialValues(enrollmentData, definition);
    const expected = { question1: '2018-11-20' };

    chai.assert.deepEqual(actual, expected);
  });


  it.only('will map array of values via mapEnrollmentToSurveyInitialValues', function () {
    const enrollmentData = {
      disabilities: [
        {
          disabilityResponse: 1,
          indefiniteandImpairs: 0,
          disabilityType: 5,
        },
        {
          disabilityResponse: 2,
          indefiniteandImpairs: 1,
          disabilityType: 6,
        },
      ],
    };

    const definition = {
      items: [
        {
          id: 'disability-type5',
          enrollment: {
            schema: 'v2017',
            uriObjectField: 'disabilities.disabilityResponse',
            defaultObject: {
              disabilityType: 5,
            },
          },
        },
        {
          id: 'disability-type6',
          enrollment: {
            schema: 'v2017',
            uriObjectField: 'disabilities.disabilityResponse',
            defaultObject: {
              disabilityType: 6,
            },
          },
        },
      ],
    };

    const actual = mapEnrollmentToSurveyInitialValues(enrollmentData, definition);
    const expected = {
      'disability-type5': 1,
      'disability-type6': 2,
    };

    chai.assert.deepEqual(actual, expected);
  });

});

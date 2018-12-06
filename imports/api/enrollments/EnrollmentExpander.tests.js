/* eslint prefer-arrow-callback: "off", func-names: "off" */

// import nock from 'nock';
// import { HmisClient } from './hmisClient';
// import { ApiRegistry } from './apiRegistry';
import { chai } from 'meteor/practicalmeteor:chai';

import {
  getEnrollmentDetails,
  getEnrollmentResultSet,
} from '/imports/__tests__/fixtures/enrollmentDetails';
import EnrollmentExpander from './EnrollmentExpander';


describe('EnrollmentExpander', function () {
  it('will return submission dates', function () {
    const expander = new EnrollmentExpander(getEnrollmentDetails());
    chai.assert.deepEqual(expander.getSubmissionDates(), ['11-29-2018 18:48', '11-29-2018 18:49']);
  });

  it('will filter data by stage and date', function () {
    const expander = new EnrollmentExpander(getEnrollmentDetails());
    expander.filterByDataCollectionStage(1);
    expander.filterByDate('11-29-2018 18:48');
    chai.assert.equal(expander.getResultSet().length, 4);
  });

  it.only('will construct fullEnrollment object', function () {
    const expander = new EnrollmentExpander(getEnrollmentDetails());
    expander.resultSet = getEnrollmentResultSet();
    const expected = {
      enrollmentCoc: {
        enrollmentCocId: 'a548abb2-e8a8-4cba-b7be-87cece49b40e',
        dataCollectionStage: 1,
        cocCode: 'CA-600              ',
      },
      disabilities: [
        {
          disabilitiesId: '6940b247-bf27-415d-9ea5-a3bca6616251',
          dataCollectionStage: 1,
          disabilityType: 6,
          disabilityResponse: 1,
          indefiniteandImpairs: 1,
        },
        {
          disabilitiesId: 'a66027c8-597a-4c33-a9ab-6aa029270657',
          dataCollectionStage: 1,
          disabilityType: 8,
          disabilityResponse: 1,
          indefiniteandImpairs: 1,
        },
        {
          disabilitiesId: '69556dd9-f24a-43e2-8b2a-3f5188b108c0',
          dataCollectionStage: 1,
          disabilityType: 5,
          disabilityResponse: 1,
          indefiniteandImpairs: 1,
        },
        {
          disabilitiesId: '1730f3cf-d661-4b2a-9b02-0a80737bcb2d',
          dataCollectionStage: 1,
          disabilityType: 10,
          disabilityResponse: 1,
          indefiniteandImpairs: 8,
        },
        {
          disabilitiesId: 'cfb69b29-3337-4a31-a2e4-5fdff3b0d69a',
          dataCollectionStage: 1,
          disabilityType: 7,
          disabilityResponse: 1,
          indefiniteandImpairs: 1,
        },
        {
          disabilitiesId: 'b675114e-246d-4e5e-8640-52d49b977de1',
          dataCollectionStage: 1,
          disabilityType: 8,
          disabilityResponse: 1,
          indefiniteandImpairs: 1,
        },
      ],
      dateOfEngagement: {
        dateOfEngagementId: '97bea28d-8c12-40b2-b4cc-10d1769043f4',
      },
      domesticViolence: {
        currentlyFleeing: 99,
        dataCollectionStage: 1,
        domesticViolenceId: '6e9c0d7d-558e-4027-bc72-3199b98e3b0c',
        domesticViolenceVictim: 9,
        whenOccurred: 99,
      },
      employment: {
        employmentId: '64eb3dea-1abe-4124-9451-201a24c50ec1',
        employed: 0,
        employmentType: 1,
        notEmployedReason: 2,
        dataCollectionStage: 1,
      },
      healthInsurance: {
        medicaid: 99,
        medicare: 99,
        schip: 99,
        cobra: 99,
        otherInsurance: 99,
        indianHealthServices: 99,
        dataCollectionStage: 1,
        healthInsuranceId: '4e162605-063a-48cf-8278-8732e4a93ba5',
        insuranceFromAnySource: 99,
        vaMedicalServices: 99,
        employerProvided: 99,
        privatePay: 99,
        stateHealthInAdults: 99,
      },
      healthStatus: {
        dataCollectionStage: 1,
        healthStatus: 99,
        healthStatusId: 'ae4cd346-f2a9-4081-a851-084db6c90053',
      },
      incomeAndSource: {
        incomeAndSourceId: '69741a60-a383-4c57-8c0d-eaf1b3be1a11',
        alimony: 99,
        alimonyamount: 0,
        earned: 1,
        ga: 99,
        pension: 99,
        ssdi: 1,
        ssi: 1,
        unemployment: 1,
        dataCollectionStage: 1,
        dateCreated: '2018-11-29',
        dateUpdated: '2018-11-29',
        childSupport: 99,
        childSupportAmount: 99,
        earnedAmount: 12.34,
        gaAmount: 99,
        incomeFromAnySource: 1,
        otherSource: 99,
        otherSourceAmount: 99,
        otherSourceIdentify: '99',
        pensionAmount: 99,
        privateDisability: 99,
        privateDisabilityAmount: 99,
        socSecRetirementAmount: 99,
        ssdiAmount: 33.33,
        ssiAmount: 22.22,
        tanfAmount: 0,
        totalMonthlyIncome: 0,
        unemploymentAmount: 11.11,
        vaDisabilityNonService: 99,
        vaDisabilityNonServiceAmount: 99,
        vaDisabilityService: 99,
        vaDisabilityServiceAmount: 99,
        workersComp: 99,
        workersCompAmount: 99,
      },
      noncashBenefits: {
        snap: 99,
        wic: 99,
        dataCollectionStage: 1,
        noncashBenefitsId: '74dd0e14-c619-4ae8-938e-951845ea75c0',
        benefitsFromAnySource: 99,
        otherTanf: 99,
        tanfChildcare: 99,
        tanfTransportation: 99,
      },
      residentialMoveinDate: {
        residentialMoveinDateId: 'c7a191bc-e002-4778-84aa-541a26768290',
        residentialMoveInDate: '2018-11-28',
      },
    };

    chai.assert.deepEqual(expander.toFullEnrollmentObject(), expected);
  });
});

/* eslint prefer-arrow-callback: "off", func-names: "off" */

import { chai } from 'meteor/practicalmeteor:chai';

import {
  getEnrollmentDetails,
  // getEnrollmentResultSet,
} from '/imports/__tests__/fixtures/enrollmentDetails';
import EnrollmentExpander from './EnrollmentExpander';


describe('EnrollmentExpander', function () {
  it('will return submission dates', function () {
    const expander = new EnrollmentExpander(getEnrollmentDetails());
    chai.assert.deepEqual(expander.getSubmissionDates(), ['2018-11-29T18:48', '2018-11-29T18:49']);
  });

  it('will filter data by stage and date', function () {
    const expander = new EnrollmentExpander(getEnrollmentDetails());
    expander.filterByDataCollectionStage(1);
    expander.filterByDateEqualOrLessThanBy('2018-11-29T18:48');
    chai.assert.equal(expander.getResultSet().length, 4);
  });
});

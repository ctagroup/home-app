/* eslint prefer-arrow-callback: "off", func-names: "off" */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import SubmissionUploaderRows,
  { RowStatus } from '/imports/api/submissionUploader/submissionUploaderRows';

class SubmissionUploaderProcessor {
  constructor({ rowsCollection }) {
    this.rowsCollection = rowsCollection;
  }
  uploadNextRow() {
    const row = this.rowsCollection.findOne();

    this.rowsCollection.update(row._id, {
      $set: {
        status: RowStatus.UPLOAD_SUCCESS,
      },
    });
    return Promise.resolve(row._id);
  }
}

describe('Submission Uploader e2e tests', function () {
  beforeEach(() => {
    resetDatabase();
    SubmissionUploaderRows.insert({
      _id: 'row1',
      status: RowStatus.PENDING,
    });
  });

  it('will successfully process a single row', function (done) {
    const rowsCollection = SubmissionUploaderRows;
    const processor = new SubmissionUploaderProcessor({ rowsCollection });
    processor.uploadNextRow()
      .then((rowId) => {
        const updatedRow = rowsCollection.findOne(rowId);
        expect(updatedRow.status).to.equal(RowStatus.UPLOAD_SUCCESS);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

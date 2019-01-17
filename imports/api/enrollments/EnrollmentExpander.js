import _ from 'lodash';
import moment from 'moment';

export default class EnrollmentExpander {
  constructor(enrollment, hmisClient) {
    this.enrollment = enrollment;
    this.hmisClient = hmisClient;
    this.reset();
  }

  reset() {
    this.resultSet = [];
    this.addToResultSet(this.enrollment.enrollmentLinks);
  }

  getResultSet() {
    return this.resultSet;
  }

  addToResultSet(links) {
    Object.keys(links).forEach(uriObject => {
      const group = links[uriObject];
      return Object.keys(group).forEach(dataCollectionStage => {
        const stageData = group[dataCollectionStage];
        Object.keys(stageData).forEach(dateStr => {
          const dateItems = stageData[dateStr];
          dateItems.forEach(dateItem => dateItem.data.forEach(data => {
            this.resultSet.push({
              data,
              dataCollectionDate: moment(dateStr),
              dataCollectionStage: dataCollectionStage * 1,
              uriObject,
            });
          }));
        });
      });
    });
    return this;
  }

  filterByDateEqualOrLessThanBy(date, lessThanInSeconds = 0) {
    this.resultSet = this.resultSet.filter(x => {
      const delta = (moment(date) - x.dataCollectionDate) / 1000;
      return 0 <= delta && delta <= lessThanInSeconds; // eslint-disable-line
    });
    return this;
  }

  filterByDataCollectionStage(dataCollectionStage) {
    this.resultSet = this.resultSet.filter(x =>
      ['unspecified_stage', dataCollectionStage].includes(x.dataCollectionStage)
    );
    return this;
  }

  expandLinks() {
    this.resultSet = this.resultSet.map(item => {
      if (item.data.href) {
        return {
          ...item,
          data: this.hmisClient.api('generic').getData(item.data.href),
        };
      }
      return item;
    });
    return this;
  }

  toFullEnrollmentObject() {
    return this.resultSet.reduce((enrollment, item) => {
      const dataKey = Object.keys(item.data).pop();

      const disabilities = enrollment.disabilities || [];
      if (dataKey === 'disabilities') {
        disabilities.push(item.data[dataKey]);
      }

      return {
        ...enrollment,
        [dataKey]: item.data[dataKey],
        disabilities,
      };
    }, {
      enrollment: this.enrollment,
    });
  }

  getSubmissionDates() {
    // return dates from oldest to newest
    const dates = this.getResultSet()
      .map(x => x.dataCollectionDate.format('YYYY-MM-DDTHH:mm'));
    const uniqueDates = _.uniq(dates);
    return uniqueDates.sort();
  }

}

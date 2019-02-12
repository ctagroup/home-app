// import moment from 'moment';
import Enrollments from '/imports/api/enrollments/enrollments';
import { TableDom } from '/imports/ui/dataTable/helpers';
import './enrollmentsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'entrydate',
      title: 'Entry Date',
    },
    {
      data: 'entrydate',
      title: 'Update Date',
    },
    // {
    //   data: 'exitdate',
    //   title: 'Exit Date',
    //   render() {

    //   },
    // },
    // {
    //   data: '',
    //   title: 'Project Name',
    //   render() {

    //   },
    // },
    // {
    //   data: '',
    //   title: 'Update',
    //   render() {

    //   },
    // },
    // {
    //   data: '',
    //   title: 'Exit',
    //   render() {

    //   },
    // },
    // // {
    // //   data: 'enrollmentName',
    // //   title: 'Name',
    // //   render(value, op, doc) {
    // //     return `<a href="${Router.path('enrollmentsEdit', { _id: doc._id })}">${value}</a>`;
    // //   },
    // // },
    // {
    //   data: 'createdAt',
    //   title: 'Created At',
    //   render(value, type) {
    //     if (type === 'sort') {
    //       return value;
    //     }
    //     return moment(value).format('MM/DD/YYYY h:mm A');
    //   },
    // },
  ],
  dom: TableDom,
  processing: true,
  deferRender: true,
};


Template.enrollmentsListView.helpers({
  hasData() {
    return Enrollments.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => Enrollments.find().fetch();
  },
});

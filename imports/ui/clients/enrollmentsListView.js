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

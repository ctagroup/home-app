import moment from 'moment';
import Projects from '/imports/api/projects/projects';
import { TableDom } from '/imports/ui/dataTable/helpers';
import './projectsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'projectName',
      title: 'Project Name',
      render(value, op, doc) {
        return `<a href="${Router.path('projectsEdit', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: 'projectCommonName',
      title: 'Common Name',
    },
    {
      data: 'projectGroup',
      title: 'Project Group',
    },
    {
      data: 'dateCreated',
      title: 'Created At',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return moment(value).format('MM/DD/YYYY h:mm A');
      },
    },
  ],
  dom: TableDom,
  processing: true,
  deferRender: true,
};


Template.projectsListView.helpers({
  hasData() {
    return Projects.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => Projects.find().fetch();
  },
});

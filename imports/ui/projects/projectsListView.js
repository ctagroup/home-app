import moment from 'moment';
import Projects from '/imports/api/projects/projects';
import { TableDom, deleteProjectButton } from '/imports/ui/dataTable/helpers';
import './projectsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'projectName',
      title: 'Project Name',
      render(value, op, doc) {
        return `<a href="${Router.path('projectsEdit', doc)}">${value}</a>`;
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
      data: 'schema',
      title: 'Schema',
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
    deleteProjectButton((project) => {
      Projects._collection.remove(project._id); // eslint-disable-line
    }),
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

import moment from 'moment';
import Projects from '/imports/api/projects/projects';
import { TableDom, deleteProjectButton } from '/imports/ui/dataTable/helpers';
import './projectsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'projectName',
      title: 'Project Name',
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
    },
    {
      data: 'Edit',
      title: 'Edit',
      render(value, op, doc) {
        return `<a href="${Router.path('projectsEdit', doc)}" class="btn btn-xs btn-primary"><i class="fa fa-pencil"></i></a>`;
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

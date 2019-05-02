import Projects from '/imports/api/projects/projects';
import { TableDom, deleteProjectButton } from '/imports/ui/dataTable/helpers';
import './projectsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'projectName',
      title: 'Project Name',
      minWidth: 280,
    },
    {
      data: 'projectCommonName',
      title: 'Common Name',
      minWidth: 300,
    },
    {
      data: 'projectGroup',
      title: 'Project Group',
      minWidth: 120,
    },
    {
      data: 'schema',
      title: 'Schema',
      minWidth: 100,
    },
    {
      data: 'dateCreated',
      title: 'Created At',
      minWidth: 100,
    },
    {
      data: 'Edit',
      title: 'Edit',
      render(value, op, doc) {
        return `<a href="${Router.path('projectsEdit', doc)}" class="btn btn-xs btn-primary"><i class="fa fa-pencil"></i></a>`; // eslint-disable-line
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

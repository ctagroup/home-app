// import moment from 'moment';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import { TableDom /* , deleteProjectButton */ } from '/imports/ui/dataTable/helpers';
import './globalProjectsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'projectName',
      title: 'Project Name',
      render(value, op, doc) {
        return `<a href="${Router.path('globalProjectsEdit', doc)}">${value || doc._id}</a>`;
      },
    },
    {
      data: 'projectCommonName',
      title: 'Common Name',
    },
    {
      data: 'projectsDetails',
      title: 'Details',
    },
    /*
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
    */
  ],
  dom: TableDom,
  processing: true,
  deferRender: true,
};


Template.globalProjectsListView.helpers({
  hasData() {
    return GlobalProjects.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    console.log(GlobalProjects.find().fetch().filter(x => x.projects.length));
    return () => GlobalProjects.find().fetch().map((gp) => {
      const projectsDetails = gp.projects.length ?
        gp.projects.map(p => p.source).sort().join(', ') : 'no projects';
      return {
        ...gp,
        projectsDetails,
      };
    });
  },
});

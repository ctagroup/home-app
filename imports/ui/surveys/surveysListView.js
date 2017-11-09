import moment from 'moment';
import Surveys from '/imports/api/surveys/surveys';
import { TableDom, editButton, deleteSurveyButton } from '/imports/ui/dataTable/helpers';
import './surveysListView.html';

const tableOptions = {
  columns: [
    {
      data: 'title',
      title: 'Survey',
      render(value, op, doc) {
        return `<a href="${Router.path('surveysPreview', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: 'createdAt',
      title: 'Created At',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return moment(value).format('MM/DD/YYYY h:mm A');
      },
    },
    {
      data: 'active',
      title: 'Active',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return value ? 'Yes' : 'No';
      },
    },
    {
      data: 'editable',
      title: 'Editable',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return value ? 'Yes' : 'No';
      },
    },
    {
      data: 'hmis',
      title: 'Status',
      render(value) {
        if (value && value.status) {
          return value.status;
        }
        return 'not uploaded';
      },
    },

    editButton('surveysEdit'),
    deleteSurveyButton(),
  ],
  dom: TableDom,
  processing: true,
  deferRender: true,
};


Template.surveysListView.helpers({
  hasData() {
    return Surveys.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => Surveys.find().fetch();
  },

});

Template.surveysListView.helpers(
  {
    surveysList() {
      return Surveys.find().fetch();
    },
  }
);

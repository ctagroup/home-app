import moment from 'moment';
import Surveys from '/imports/api/surveys/surveys';
import { TableDom, editButton, deleteSurveyButton } from '/imports/ui/dataTable/helpers';
import './surveysListView.html';

const tableOptions = {
  columns: [
    {
      data: 'title',
      title: 'Survey',
      minWidth: 200,
      render(value, op, doc) {
        return `<a href="${Router.path('surveysPreview', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: 'numberOfResponses',
      title: 'Responses',
      minWidth: 120,
    },
    {
      data: 'hudSurvey',
      title: 'Type',
      minWidth: 100,
      render(value, op, doc) {
        return value ? `HUD ${doc.surveyVersion}` : '';
      },
    },
    {
      data: 'hmis',
      title: 'Status',
      minWidth: 100,
      render(value) {
        if (value && value.status) {
          return value.status;
        }
        return 'not uploaded';
      },
    },
    {
      data: 'locked',
      title: 'Locked',
      minWidth: 100,
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return value ? 'Yes' : 'No';
      },
    },
    {
      data: 'createdAt',
      title: 'Created At',
      minWidth: 150,
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return value ? moment(value).format('MM/DD/YYYY h:mm A') : '-';
      },
    },
    editButton('surveysEdit'),
    editButton('surveysEditDefinition', { title: 'Builder', width: '60px' }),
    deleteSurveyButton((survey) => {
      Surveys._collection.remove(survey._id); // eslint-disable-line
    }),

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

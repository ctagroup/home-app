import { TableDom } from '/imports/ui/dataTable/helpers';
import moment from 'moment';
import Responses from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import './responsesListView.html';


const tableOptions = {
  columns: [
    {
      data: 'surveyID',
      title: 'Survey',
      render(value, type, doc) {
        const survey = Surveys.findOne({ _id: value });
        const url = Router.path('adminDashboardresponsesEdit', { _id: doc._id });
        let title = value;
        if (survey) {
          title = survey.title;
        }
        return `<a href="${url}">${title}</a>`;
      },
    },
    {
      data: 'clientID',
      title: 'Client',
      render(value, type, doc) {
        const response = doc;
        const client = response.clientDetails;

        if (client) {
          let displayName = `${client.firstName} ${client.middleName} ${client.lastName}`;
          displayName = displayName.trim();

          if (!displayName) {
            displayName = response.clientID;
          }

          let url = Router.path(
            'viewClient',
            { _id: response.clientID }
          );
          if (response.isHMISClient && response.clientSchema) {
            url = Router.path(
              'viewClient',
              { _id: response.clientID },
              { query: `isHMISClient=true&schema=${response.clientSchema}` }
            );
          }
          return `<a href="${url}">${displayName}</a>`;
        }

        return response.clientID;
      },
    },
    {
      data: 'timestamp',
      title: 'Date Updated',
      render(value) {
        return moment(value).format('MM/DD/YYYY');
      },
    },
    {
      data: 'responsestatus',
      title: 'Status',
      searchable: false,
      render(value, type, doc) {
        let val = '';
        const responseDetails = doc;
        const subId = responseDetails.submissionId;
        switch (value) {
          case 'Completed':
            if (subId) {
              val = '<span class="text-success">' +
                '<i class="fa fa-check"></i> ' +
                'Submitted' +
                '</span>' +
                '<br>' +
                `<a id="${doc._id}" href="#" class="btn UploadResponses">` +
                '(Re-Upload to HMIS)</a>';
            } else {
              if (responseDetails.isHMISClient && responseDetails.clientSchema) {
                val =
                `<a href="#" id="${doc._id}" class="btn UploadResponses">Upload to HMIS</a>`;
              } else {
                val = '<span class="text-warning">Upload client first</span>';
              }
            }
            break;
          case 'Paused':
            val = '<span class="text-muted"><i class="fa fa-pause"></i> Paused</span>';
            break;
          case 'Uploading':
            val = '<i class="fa fa-spinner fa-pulse"></i>';
            break;
          default:
            val = value;
            break;
        }

        return val;
      },
    },
  ],
  dom: TableDom,
  processing: true,
  deferRender: true,
};

Template.responsesListView.helpers({
  hasData() {
    return Responses.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => Responses.find().fetch();
  },
});

Template.responsesListView.events(
  {
    'click .UploadResponses': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('id');
      const parent = $(`#${responseId}`).parent();
      const originalHtml = parent.html();
      parent.html('<i class="fa fa-spinner fa-pulse"></i>');

      Meteor.call('uploadResponse', responseId, (err) => {
        if (err) {
          parent.html(originalHtml);
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Response uploaded', 'success', 'growl-top-right');
          const htmlOk = '<span class="text-success">' +
                  '<i class="fa fa-check"></i> ' +
                  'Submitted' +
                  '</span>' +
                  '<br>' +
                  `<a id="${responseId}" href="#" class="btn UploadResponses">` +
                  '(Re-Upload to HMIS)</a>';
          // change button to completed.
          parent.html(htmlOk);
        }
      });
    },
  }
);

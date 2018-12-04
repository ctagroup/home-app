import Alert from '/imports/ui/alert';
import { deleteResponseButton, TableDom } from '/imports/ui/dataTable/helpers';
import moment from 'moment';
import Responses, { ResponseStatus } from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import { fullName } from '/imports/api/utils';
import './responsesListView.html';


const uploadingHtml = '<i class="fa fa-spinner fa-pulse"></i>';
function completedHtml(response, status) {
  let statusClass;
  switch (status) {
    case 'warning':
      statusClass = 'text-warning';
      break;
    default:
      statusClass = 'text-success';
  }
  const date = moment(response.submittedAt).format('MM/DD/YYYY h:mm A');
  let html = `
    <span class="${statusClass}">
      <i class="fa fa-check"></i> Submitted on ${date}
    </span>
    <br />
    <a id="${response._id}" href="#" class="btn UploadResponses">
      (Re-Upload to HMIS)
    </a>`;

  if (response.surveyType === 'enrollment') {
    if (!response.enrollment) {
      html += `<div>
        <a id="enrollment-${response._id}" data-id="${response._id}"
        href="#" class="btn UploadEnrollment">
          Upload Enrollment
        </a></div>`;
    } else {
      html += '<div>Enrollment Uploaded</div>';
    }
  }
  return html;
}


const tableOptions = {
  pageLength: 50,
  columns: [
    {
      data: 'surveyId',
      title: 'Survey',
      render(value, type, doc) {
        const survey = Surveys.findOne({ _id: value });
        const url = Router.path('adminDashboardresponsesEdit', { _id: doc._id });
        const title = survey ? survey.title : value;
        return `<a href="${url}">${title}</a>`;
      },
    },
    {
      data: 'clientId',
      title: 'Client',
      render(value, type, response) {
        const clientDetails = response.clientDetails || { loading: true };

        if (clientDetails.loading) {
          return 'Loading...';
        }
        if (clientDetails.error) {
          return `
            ${clientDetails.error}<br />
            ID: ${response.clientId}<br />
            Schema: ${response.clientSchema}`;
        }

        const displayName = fullName(clientDetails) || response.clientId;

        let url = Router.path('viewClient', { _id: response.clientId });
        if (response.clientSchema) {
          url = Router.path('viewClient',
            { _id: response.clientId },
            { query: `schema=${response.clientSchema}` }
          );
        }
        return `<a href="${url}">${displayName}</a>`;
      },
    },
    {
      data: 'createdAt',
      title: 'Date Created',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return moment(value).format('MM/DD/YYYY h:mm A');
      },
    },
    {
      data: 'updatedAt',
      title: 'Date Updated',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return moment(value).format('MM/DD/YYYY h:mm A');
      },
    },
    {
      data: 'status',
      title: 'Status',
      searchable: false,
      render(value, type, response) {
        switch (value) {
          case ResponseStatus.PAUSED:
            return '<span class="text-muted"><i class="fa fa-pause"></i> Paused</span>';
          case ResponseStatus.COMPLETED:
            if (response.submissionId) {
              return completedHtml(response);
            }
            if (response.clientSchema) {
              return `<a href="#" id="${response._id}"
                class="btn UploadResponses">Upload to HMIS</a>`;
            }
            return '<span class="text-warning">Upload client first</span>';

          case ResponseStatus.UPLOADING:
            return uploadingHtml;
          case ResponseStatus.UPLOAD_ERROR:
            return `
              <i class="fa fa-exclamation-circle"></i> Upload Error</span><br />
              <a href="#" id="${response._id}" class="btn UploadResponses">Re-Upload to HMIS</a>`;
          default:
            return value;
        }
      },
    },
    {
      data: 'version',
      title: 'Version',
    },
    deleteResponseButton((response) => {
      Responses._collection.remove(response._id); // eslint-disable-line
    }),
  ],
  order: [
    [2, 'desc'],
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
  clientDoesNotExist() {
    return this.clientId && !this.client;
  },
  newResponsePath() {
    const { clientId, schema } = Router.current().params.query;
    const query = schema ? { schema } : {};
    return Router.path('selectSurvey', { _id: clientId }, { query });
  },
});

Template.responsesListView.events(
  {
    'click .UploadResponses': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('id');
      const parent = $(`#${responseId}`).closest('td');
      const originalHtml = parent.html();
      parent.html(uploadingHtml);

      Meteor.call('responses.uploadToHmis', responseId, (err, invalidResponses) => {
        if (err) {
          Alert.error(err);
          parent.html(originalHtml);
        } else {
          if (invalidResponses.length > 0) {
            const list = invalidResponses.map(r => r.id).join(', ');
            Alert.warning(`Success but ${invalidResponses.length} responses not uploaded: ${list}`);
            parent.html(completedHtml(Responses.findOne(responseId), 'warning'));
          } else {
            Alert.success('Response uploaded');
            parent.html(completedHtml(Responses.findOne(responseId)));
          }
        }
      });
    },
    'click .UploadEnrollment': (evt/* , tmpl*/) => {
      evt.preventDefault();
      const responseId = $(evt.currentTarget).attr('data-id');
      const parent = $(`#${responseId}`).closest('td');
      const originalHtml = parent.html();
      parent.html(uploadingHtml);
      Meteor.call('responses.uploadEnrollment', responseId, (err, res) => {
        if (err) {
          Alert.error(err);
          parent.html(originalHtml);
        } else {
          Alert.success('Enrollment uploaded');
          parent.html(completedHtml({
            ...Responses.findOne(responseId),
            enrollment: res,
          }));
        }
      });
    },
  }
);

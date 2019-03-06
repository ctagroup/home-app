import Alert from '/imports/ui/alert';
import { deleteResponseButton, TableDom } from '/imports/ui/dataTable/helpers';
import moment from 'moment';
import Responses, { ResponseStatus } from '/imports/api/responses/responses';
import Surveys from '/imports/api/surveys/surveys';
import { Clients } from '/imports/api/clients/clients';
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
      render(surveyId, type, response) {
        const { survey } = response;
        if (survey.error) {
          return `${survey.error}<br />${surveyId}`;
        }
        const url = Router.path('adminDashboardresponsesEdit', { _id: response._id, surveyId });
        const title = survey ? survey.surveyTitle : surveyId;
        return `<a href="${url}">${title}</a>`;
      },
      filterMethod(filter, row, column) {
        // row  || rows
        const value = row[column.id];
        const survey = Surveys.findOne({ _id: value });
        const title = survey ? survey.title : value;
        return title.toLowerCase().includes(filter.value.toLowerCase());
        // return false;
      },
    },
    {
      data: 'clientId',
      title: 'Client',
      render(value, type, response) {
        const { client } = response;
        if (!client) return response.clientId;
        if (client.error) {
          return `
            ${client.error}<br />
            ID: ${response.clientId}<br />
            Schema: ${response.clientSchema}`;
        }
        const displayName = fullName(client);
        let url = Router.path('viewClient', { _id: response.clientId });
        if (response.clientSchema) {
          url = Router.path('viewClient',
            { _id: response.clientId },
            { query: `schema=${response.clientSchema}` }
          );
        }
        return `<a href="${url}">${displayName}</a>`;
      },
      filterMethod(filter, row /* , column*/) {
        const response = row;
        const clientData = Clients.findOne(response.clientId);
        // const clientDetails = response.clientDetails || { loading: true };
        const clientDetails = clientData || { loading: true };
        // TODO: trigger client data load if no data coming from subscription
        let value = '';
        if (clientDetails.loading) {
          value = 'Loading...';
        } else {
          value = fullName(clientDetails) || response.clientId;
        }
        return value.toLowerCase().includes(filter.value.toLowerCase());
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
      sortMethod: (a, b) => {
        const aM = moment(a).toDate();
        const bM = moment(b).toDate();
        if (aM === bM) return 0;
        return aM > bM ? 1 : -1;
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
      filterable: false,
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
    return [];
  },
  clientDoesNotExist() {
    return this.clientId && !this.client;
  },
  newResponsePath() {
    const { clientId, schema } = Router.current().params.query;
    const query = schema ? { schema } : {};
    return Router.path('selectSurvey', { _id: clientId }, { query });
  },
  loadData() {
    return () => ((pageNumber, pageSize, sort, order, callback) => {
      console.log('responses list is fetching data');
      const sortBy = Array.isArray(sort) ? sort[0] : sort;
      const orderBy = Array.isArray(order) ? order[0] : order;
      // return Meteor.subscribe('responses.page', pageNumber, pageSize, sortBy, orderBy);
      return Meteor.call('responses.getPage', pageNumber, pageSize, sortBy, orderBy,
        (err, res) => {
          console.log('page res', err, res);
          res.content.forEach(response => {
            // const schema = getClientSchemaFromLinks(response.links, 'v2015');
            // Object.assign(response.client, { schema });
            Responses._collection.update(response._id, response, {upsert: true}); // eslint-disable-line
          });
          const data = Responses.find({}).fetch();
          const pages = res.page.totalPages;
          if (callback) callback({ data, pages });
        });
    });
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

import React from 'react';
import { computeFormState } from '/imports/api/surveys/computations';
import Section from '/imports/ui/components/surveyForm/Section';
import { ResponseStatus } from '/imports/api/responses/responses';
import Alert from '/imports/ui/alert';
import { fullName } from '/imports/api/utils';
import { logger } from '/imports/utils/logger';
import { RecentClients } from '/imports/api/recent-clients';


export default class Survey extends React.Component {
  constructor(props) {
    super(props);
    const initialValues = props.initialValues || {};
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleDebugWindow = this.handleToggleDebugWindow.bind(this);
    this.state = {
      ...computeFormState(
        this.props.definition,
        initialValues,
        {},
        {
          client: props.client,
          project: props.project || {},
          enrollmentInfo: props.enrollmentInfo || {},
        }
      ),
      errors: {},
    };
  }

  handleValueChange(name, value, isValid = true) {
    // check for array names i.e. 'foo[12]'
    const match = name.match(/([^[]+)\[(\d+)\]/);
    let newValues;
    if (match) {
      // handle array data
      const arrName = match[1];
      const arrIdx = match[2];
      const v = this.state.values[arrName];
      const arr = Array.isArray(v) ? v : [];
      arr[arrIdx] = value;
      newValues = Object.assign({}, this.state.values, {
        [arrName]: arr,
      });
    } else {
      // handle normal data
      newValues = Object.assign({}, this.state.values, {
        [name]: value,
      });
      if (value === '') {
        delete newValues[name];
      }
    }

    const formState = computeFormState(
      this.props.definition,
      newValues,
      this.state.props,
      { client: this.props.client }
    );
    const errors = this.state.errors;
    if (isValid) {
      delete errors[name];
    } else {
      errors[name] = true;
    }
    this.setState({
      ...formState,
      errors,
    });
  }

  handlePropsChange(name, value) {
    const props = Object.assign({}, this.state.props, {
      [name]: value,
    });
    if (!value) {
      delete props[name];
    }

    const formState = computeFormState(
      this.props.definition,
      this.state.values,
      props,
      { client: this.props.client }
    );
    this.setState(formState);
  }

  /*
  handleSubmit(uploadSurvey, uploadClient) {
    const values = this.state.values;
    const definition = this.props.definition;
    const formState = computeFormState(definition, values, {}, { client: this.props.client });

    const emails = prepareEmails(definition, formState);
  }
  */

  handleSubmit(uploadSurvey, uploadClient) {
    let clientId;
    let clientSchema;

    if (this.props.response && this.props.response.clientDetails) {
      clientId = this.props.response.clientDetails.clientId;
      clientSchema = this.props.response.clientDetails.clientSchema;
    } else {
      clientId = this.props.client._id;
      clientSchema = this.props.client.schema;
    }

    const surveyType = this.props.definition.type;


    const doc = {
      clientId,
      clientSchema,
      surveyType,
      status: ResponseStatus.PAUSED,
      surveyId: this.props.surveyId,
      values: this.state.values,
    };
    if (this.props.enrollmentInfo) doc.enrollmentInfo = this.props.enrollmentInfo;
    // const isEnrollmentSurvey = this.props.isEnrollment;
    const history = [];
    let newlyCreatedResponseId = null;

    this.setState({ submitting: true });
    new Promise((resolve, reject) => {
      if (this.props.response) {
        const responseId = this.props.response._id;
        Meteor.call('responses.update', responseId, doc, (err) => {
          if (err) {
            history.push(`Failed to update response: ${err}`);
            reject(err);
          } else {
            history.push('Response updated');
            resolve(responseId);
          }
        });
      } else {
        Meteor.call('responses.create', doc, (err, newResponseId) => {
          if (err) {
            history.push(`Failed to create response: ${err}`);
            reject(err);
          } else {
            newlyCreatedResponseId = newResponseId;
            history.push(`Response created: ${newResponseId}`);
            resolve(newResponseId);
          }
        });
      }
    })
    .then(responseId => {
      if (uploadClient) {
        return new Promise((resolve, reject) => {
          Meteor.call('uploadPendingClientToHmis', clientId, (err, hmisClient) => {
            if (err) {
              history.push(`Failed to upload client: ${err}`);
              reject(err);
            } else {
              RecentClients.updateId(clientId, hmisClient);
              history.push(`Client uploaded as ${JSON.stringify(hmisClient)}`);
              resolve(responseId);
            }
          });
        });
      }
      return responseId;
    })
    .then(responseId =>
      new Promise((resolve) => {
        Meteor.call('responses.sendEmails', responseId, () => {
          resolve(responseId);
        });
      })
    )
    .then(responseId => {
      if (uploadSurvey) {
        return new Promise((resolve, reject) => {
          Meteor.call('responses.uploadToHmis', responseId, (err, invalidResponses) => {
            if (err) {
              history.push(`Failed to upload response: ${err}`);
              reject(err);
            } else {
              history.push('Response uploaded');
              resolve(invalidResponses);
            }
          });
        });
      }
      history.push('Response not uploaded');
      return null;
    })
    .then((invalidResponses) => {
      if (invalidResponses === null) {
        Alert.success('Response paused');
      } else if (invalidResponses.length > 0) {
        const list = invalidResponses.map(r => r.id).join(', ');
        Alert.warning(`Success but ${invalidResponses.length} questions not uploaded: ${list}`);
      } else {
        Alert.success('Success. Response uploaded');
      }
      // TODO: upload enrollment if any:
      if (Roles.userIsInRole(Meteor.userId(), 'External Surveyor')) {
        Router.go('dashboard');
      } else {
        Router.go('adminDashboardresponsesView');
      }
      this.setState({ submitting: false });
    })
    .catch(err => {
      const correlationId = newlyCreatedResponseId || this.props.response._id;
      this.setState({ submitting: false });
      history.unshift('Failed to upload the response. Details:');
      history.push(`ResponseId: ${correlationId}`);
      Alert.error(err, history.join('<br>'));
      alert(history.join('\n')); // eslint-disable-line no-alert
      logger.error(history);
      if (newlyCreatedResponseId) {
        Router.go('adminDashboardresponsesEdit', { _id: newlyCreatedResponseId });
      }
    });
  }

  handleToggleDebugWindow() {
    this.setState({
      showDebugWindow: !this.state.showDebugWindow,
    });
  }

  renderDebugTable(name, data) {
    const rows = (Object.keys(data || {})).sort().map(v => {
      let text = `${data[v]}`;
      if (text.length > 50) text = `${text.substring(0, 47)}...`;
      return (
        <tr key={`${name}-${v}`}>
          <td>{v}</td>
          <td>{text}</td>
        </tr>
      );
    });
    if (rows.length === 0) {
      rows.push(<tr key={`empty-${name}`}><td>Empty</td></tr>);
    }
    return rows;
  }

  renderDebugWindow() {
    const checkBox = (
      <label>
        <input
          type="checkbox"
          value={this.state.showDebugWindow}
          onClick={this.handleToggleDebugWindow}
        />
        Show Debug Info
      </label>
    );
    if (!this.state.showDebugWindow) {
      return (<div className="survey-debug">
        {checkBox}
      </div>);
    }
    const formState = this.state;
    const tables = (Object.keys(formState) || []).sort().map(t => (
      <table key={`table-${t}`}>
        <caption>{t}</caption>
        <tbody>
          {this.renderDebugTable(t, formState[t])}
        </tbody>
      </table>
    ));

    return (
      <div className="survey-debug">
        {checkBox}
        <h6>Debug info</h6>
        {tables}
      </div>
    );
  }

  renderSubmitButtons() {
    const submissionId = this.props.response && this.props.response.submissionId;
    const client = this.props.client;
    const hasErrors = Object.keys(this.state.errors).length > 0;
    const disabled = !client
      || this.state.submitting
      || hasErrors;
      // || status === ResponseStatus.COMPLETED;
    const uploadClient = client && !client.schema;

    let uploadButtonText = 'Upload client and survey';
    if (!uploadClient) {
      uploadButtonText = submissionId ? 'Re-Upload survey' : 'Upload survey';
    }

    return (
      <div>
        {submissionId &&
          <div className="alert alert-warning" role="alert">
            Response already uploaded to HMIS (submissionId: {submissionId})
          </div>
        }
        <div>
          <button
            className="btn btn-success"
            type="button"
            disabled={disabled}
            onClick={() => this.handleSubmit(true, uploadClient)}
          >
            {uploadButtonText}
          </button>
          &nbsp;
          <button
            className="btn btn-default"
            type="button"
            disabled={disabled}
            onClick={() => this.handleSubmit(false, false)}
          >
            Pause Survey
          </button>
        </div>
        {hasErrors && <div className="error-message">Survey has errors</div>}
      </div>
  );
  }

  render() {
    const root = this.props.definition;
    const formState = this.state;
    const client = this.props.client || {};
    const status = this.props.response ? this.props.response.status : 'new';
    const clientName = fullName(client) || client._id || 'n/a';
    return (
      <div className="survey">
        <p><strong>Client:</strong> {clientName}</p>
        <p><strong>Response status:</strong> {status}</p>
        <Section
          item={root}
          formState={formState}
          onValueChange={this.handleValueChange}
          onPropsChange={this.handlePropsChange}
          level={1}
          debugMode={this.props.debugMode}
        />
        {this.renderSubmitButtons()}
        {this.props.debugMode && this.renderDebugWindow()}
      </div>
    );
  }
}

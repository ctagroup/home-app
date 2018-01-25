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
    this.state = computeFormState(
      this.props.definition,
      initialValues,
      {},
      { client: props.client }
    );
  }

  handleValueChange(name, value) {
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
    this.setState(formState);
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

  handleSubmit(uploadSurvey, uploadClient) {
    const { _id: clientId, schema: clientSchema } = this.props.client;
    const doc = {
      clientId,
      clientSchema,
      status: ResponseStatus.PAUSED,
      surveyId: this.props.surveyId,
      values: this.state.values,
    };
    const history = [];

    this.setState({ submitting: true });
    new Promise((resolve, reject) => {
      if (this.props.response) {
        const responseId = this.props.response._id;
        Meteor.call('responses.update', responseId, doc, (err) => {
          if (err) {
            history.push('Failed to update response');
            reject(err);
          } else {
            history.push('Response updated');
            resolve(responseId);
          }
        });
      } else {
        Meteor.call('responses.create', doc, (err, newResponseId) => {
          if (err) {
            history.push('Failed to create response');
            reject(err);
          } else {
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
      history.push(`Client not uploaded (id: ${clientId})`);
      return responseId;
    })
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
      Router.go('adminDashboardresponsesView');
      this.setState({ submitting: false });
    })
    .catch(err => {
      const correlationId = 'abcd';
      this.setState({ submitting: false });
      history.unshift('Failed to upload the response. Details:');
      history.push(correlationId);
      Alert.error(err, history.join('<br>'));
      alert(history.join('\n')); // eslint-disable-line no-alert
      logger.error(history);
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
      if (text.length > 50) {
        text = `${text.substring(0, 47)}...`;
      }
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
    const status = this.props.response && this.props.response.status;
    const client = this.props.client;
    const disabled = !client
      || this.state.submitting
      || status === ResponseStatus.COMPLETED;
    const uploadClient = client && !client.schema;

    return (
      <div>
        <button
          className="btn btn-success"
          type="button"
          disabled={disabled}
          onClick={() => this.handleSubmit(true, uploadClient)}
        >
          {uploadClient ? 'Upload client and survey' : 'Upload survey'}
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
  );
  }

  render() {
    const root = this.props.definition;
    const formState = this.state;
    const client = this.props.client || {};
    const status = this.props.response ? this.props.response.status : 'new';
    const clientName = fullName(client) || client._id || 'n/a';
    return (
      <div>
        <p><strong>Client:</strong> {clientName}</p>
        <p><strong>Response status:</strong> {status}</p>
        <Section
          item={root}
          formState={formState}
          onValueChange={this.handleValueChange}
          onPropsChange={this.handlePropsChange}
          level={1}
        />
        {this.renderSubmitButtons()}
        {this.props.debug && this.renderDebugWindow()}
      </div>
    );
  }
}
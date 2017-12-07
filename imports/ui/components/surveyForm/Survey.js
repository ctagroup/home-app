import React from 'react';
import { computeFormState } from '/imports/api/surveys/computations';
import Section from '/imports/ui/components/surveyForm/Section';
import Alert from '/imports/ui/alert';


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
      surveyId: this.props.surveyId,
      values: this.state.values,
    };
    const responseId = this.props.responseId;

    const promise = new Promise((resolve, reject) => {
      if (responseId) {
        Meteor.call('responses.update', responseId, doc, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(responseId);
          }
        });
      } else {
        Meteor.call('responses.create', doc, (err, newResponseId) => {
          if (err) {
            reject(err);
          } else {
            resolve(newResponseId);
          }
        });
      }
    }).catch(err => {
      Alert.error(err);
    });

    promise.then(id => {
      if (uploadClient && 0) {
        return new Promise((resolve, reject) => {
          Meteor.call('uploadPendingClientToHmis', clientId, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(id);
            }
          });
        });
      }
      return id;
    }).catch(err => {
      Alert.error(err, 'Failed to upload client. Survey not uploaded.');
      // Router.go('adminDashboardresponsesView');
    });

    promise.then(id => new Promise((resolve, reject) => {
      console.log('c', id);
      Meteor.call('responses.uploadToHmis', id, (err, invalidResponses) => {
        if (err) {
          console.log('cx');
          reject(err);
        } else {
          console.log('c1');
          resolve(invalidResponses);
        }
      });
    })).catch(err => {
      console.log('cr');
      Alert.error(`Failed to upload survey. ${err}`);
      Router.go('adminDashboardresponsesView');
    });

    promise.then((invalidResponses) => {
      console.log('d', invalidResponses);
      if (invalidResponses.length > 0) {
        console.log(invalidResponses);
        const list = invalidResponses.map(r => r.id).join(', ');
        Alert.warning(`Success but ${invalidResponses.length} responses not uploaded: ${list}`);
      } else {
        Alert.success('Response uploaded');
      }
      Router.go('adminDashboardresponsesView');
    }).catch(err => {
      console.log('dr');
      Alert.error(err);
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
    const disabled = !this.props.client;
    const uploadClient = !this.props.client.clientId;

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
    return (
      <div>
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

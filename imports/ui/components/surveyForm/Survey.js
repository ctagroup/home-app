import React from 'react';
import { computeFormState } from '/imports/api/surveys/computations';
import Section from '/imports/ui/components/surveyForm/Section';

// http://localhost:3000/responses/new?clientId=FzFxvqMDjE8w2nAMP&surveyId=Choose


export default class Survey extends React.Component {
  constructor(props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
    this.state = computeFormState(this.props.definition, {}, {}, { client: props.client });
  }

  handleValueChange(name, value) {
    const values = Object.assign({}, this.state.values, {
      [name]: value,
    });
    if (!value) {
      delete values[name];
    }

    const formState = computeFormState(
      this.props.definition,
      values,
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

  renderDebugTable(name, data) {
    const rows = (Object.keys(data) || []).map(v => {
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
    const formState = this.state;
    const tables = (Object.keys(formState) || []).map(t => (
      <table key={`table-${t}`}>
        <caption>{t}</caption>
        <tbody>
          {this.renderDebugTable(t, formState[t])}
        </tbody>
      </table>
    ));

    return (
      <div className="survey-debug">
        <h6>Debug info</h6>
        {tables}
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
        {this.props.debug && this.renderDebugWindow()}
      </div>
    );
  }
}

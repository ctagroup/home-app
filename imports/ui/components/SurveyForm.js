import React from 'react';
import SurveySection from '/imports/ui/components/SurveySection';


export default class SurveyForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      values: {},
      variables: props.variables,
    };
  }

  handleChange(name, value) {
    const values = Object.assign({}, this.state.values, {
      [name]: value,
    });
    if (!value) {
      delete values[name];
    }
    this.setState({ values });
  }

  renderSections() {
    const sections = this.props.definition.sections || [];
    const formValues = {
      questions: this.state.values,
      variables: this.state.variables,
      client: this.props.client,
    };
    return sections.map(section => (
      <SurveySection
        key={section.id}
        section={section}
        values={formValues}
        onChange={this.handleChange}
      />
    ));
  }

  render() {
    return (
      <div>
        <h1>{this.props.definition.title}</h1>
        {this.renderSections()}
      </div>
    );
  }
}

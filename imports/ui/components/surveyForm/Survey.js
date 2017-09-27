import React from 'react';
import { computeFormState } from '/imports/api/surveys/computations';
import Section from '/imports/ui/components/surveyForm/Section';

// http://localhost:3000/responses/new?clientId=FzFxvqMDjE8w2nAMP&surveyId=Choose


export default class Survey extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = computeFormState(this.props.definition, {}, { client: props.client });
  }

  handleChange(name, value) {
    const values = Object.assign({}, this.state.values, {
      [name]: value,
    });
    if (!value) {
      delete values[name];
    }

    const formState = computeFormState(this.props.definition, values, { client: this.props.client });
    this.setState(formState);
  }

  renderSections() {
    const sections = this.props.definition.sections || [];
    const formState = this.state;
    return sections.map(section => (
      <Section
        key={section.id}
        section={section}
        formState={formState}
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

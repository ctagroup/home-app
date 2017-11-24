import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import VariableField from '/imports/ui/components/surveyBuilder/formFields/VariableField';
import { handleFormTransform } from './helpers';


export default class FormInspector extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleTransform = this.handleTransform.bind(this);
    this.dataToSend = null;
  }

  handleChange() {
    Meteor.setTimeout(() => {
      this.props.onChange(this.dataToSend);
    }, 1);
  }

  handleTransform(mode, model) {
    const transformed = handleFormTransform(mode, model);
    this.dataToSend = this.props.onChange(transformed);
    return model;
  }

  generateSchema() {
    const VariableSchema = new SimpleSchema({
      name: {
        type: String,
      },
      value: {
        type: String,
        optional: true,
      },
    });

    return new SimpleSchema({
      variables: {
        type: [VariableSchema],
        optional: true,
      },
    });
  }

  render() {
    const schema = this.generateSchema();

    const variableNames = Object.keys(this.props.definition.variables || {});
    const variables = variableNames.map(v => ({
      name: v,
      value: this.props.definition.variables[v],
    }));

    const model = {
      variables,
    };

    return (
      <div className="item-inspector">
        <h3>Form Inspector</h3>
        <AutoForm
          schema={schema}
          model={model}
          onChange={this.handleChange}
          modelTransform={this.handleTransform}
        >
          <AutoField name="variables" itemProps={{ component: VariableField }} />
        </AutoForm>
      </div>
    );
  }

}

import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import VariableField from './VariableField';


export default class FormInspector extends React.Component {
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
      value: 0,
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
          onChange={this.props.onChange}
        >
          <AutoField name="variables" itemProps={{ component: VariableField }} />
        </AutoForm>
      </div>
    );
  }

}

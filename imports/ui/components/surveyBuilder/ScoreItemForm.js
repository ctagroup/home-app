import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { ScoreDefinitionSchema } from '/imports/api/surveys/definitionSchemas';

export default class ScoreItemForm extends React.Component {
  render() {
    return (
      <AutoForm
        schema={ScoreDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="score" />
        <AutoField name="text" />
        <AutoField name="rules" />
      </AutoForm>
    );
  }
}

import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { GridDefinitionSchema } from '/imports/api/surveys/definitionSchemas';

export default class GridItemForm extends React.Component {
  render() {
    return (
      <AutoForm
        schema={GridDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <AutoField name="rules" />
      </AutoForm>
    );
  }
}

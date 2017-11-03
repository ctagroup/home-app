import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { QuestionDefinitionSchema } from '/imports/api/surveys/definitionSchemas';

export default class QuestionItemForm extends React.Component {
  render() {
    console.log(this.props.model);
    return (
      <AutoForm
        schema={QuestionDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <AutoField name="category" />
        <AutoField name="refusable" />
        <AutoField name="rules" />
      </AutoForm>
    );
  }
}

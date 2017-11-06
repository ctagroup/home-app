import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { SectionDefinitionSchema } from '/imports/api/surveys/definitionSchemas';

export default class SectionItemForm extends React.Component {
  render() {
    return (
      <AutoForm
        schema={SectionDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <AutoField
          name="skip"
          label="Skip label"
          help="Type any text here to add a skippable checkbox"
        />
      </AutoForm>
    );
  }
}

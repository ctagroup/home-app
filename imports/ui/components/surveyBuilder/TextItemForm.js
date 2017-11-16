import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { TextDefinitionSchema } from '/imports/api/surveys/definitionSchemas';
import RuleField from '/imports/ui/components/surveyBuilder/formFields/RuleField';
import RichTextEditor from './RichTextEditor';

export default class TextItemForm extends React.Component {
  render() {
    return (
      <AutoForm
        schema={TextDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <RichTextEditor
          name="text"
          className=""
          toolbar={[
            ['bold', 'italic'], ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ]}
        />
        <AutoField name="rules" itemProps={{ component: RuleField }} />
      </AutoForm>
    );
  }
}

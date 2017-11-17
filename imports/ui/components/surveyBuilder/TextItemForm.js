import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import { AutoField, ListField } from 'uniforms-bootstrap3';
import { TextDefinitionSchema } from '/imports/api/surveys/definitionSchemas';
import RuleField from '/imports/ui/components/surveyBuilder/formFields/RuleField';
import RichTextEditor from './RichTextEditor';

function handleModelTransform(mode, model) {
  const transformed = {
    ...model,
    rules: (model.rules || []).map(r => {
      if (!r.type) {
        return r;
      }
      const conditions = r.any || r.all;
      const actions = r.always || r.then;
      console.log('zzz', actions, r.type);
      return {
        [r.type]: conditions,
        always: r.type === 'always' ? actions : undefined,
        then: r.type !== 'always' ? actions : undefined,
      };
    }),
  };
  console.log('zzz', model, transformed);
  return transformed;
}

export default class TextItemForm extends React.Component {
  render() {
    return (
      <AutoForm
        schema={TextDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
        modelTransform={handleModelTransform}
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
        <ListField
          name="rules"
          itemProps={{ component: RuleField }}
          addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Rule</span>}
          removeIcon={<span><i className="glyphicon glyphicon-minus" /> Delete Rule</span>}
        />
      </AutoForm>
      //
    );
  }
}

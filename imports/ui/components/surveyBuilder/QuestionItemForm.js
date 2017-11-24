import React from 'react';
import { AutoField, AutoForm, ListField } from 'uniforms-bootstrap3';
import RuleField from '/imports/ui/components/surveyBuilder/formFields/RuleField';
import { QuestionDefinitionSchema } from '/imports/api/surveys/definitionSchemas';
import { handleItemTransform } from './helpers';


export default class QuestionItemForm extends React.Component {
  render() {
    console.log('QuestionItemForm', this.props.model);
    const choiceFields = this.props.model.category === 'choice' ?
      (<div className="panel panel-default">
        <div className="panel-heading">Choice</div>
        <div className="panel-body">
          <AutoField name="options" />
          <AutoField
            name="other"
            label="Add 'Other' option"
          />
        </div>
      </div>) : null;
    return (
      <AutoForm
        schema={QuestionDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
        modelTransform={handleItemTransform}
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <AutoField name="category" />
        {choiceFields}
        <AutoField name="refusable" />
        <ListField
          name="rules"
          itemProps={{ component: RuleField }}
          addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Rule</span>}
          removeIcon={<span><i className="glyphicon glyphicon-minus" /> Delete Rule</span>}
        />
      </AutoForm>
    );
  }
}

import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { QuestionDefinitionSchema } from '/imports/api/surveys/definitionSchemas';

export default class QuestionItemForm extends React.Component {
  render() {
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
      >
        <AutoField name="id" />
        <AutoField name="type" />
        <AutoField name="title" />
        <AutoField name="category" />
        {choiceFields}
        <AutoField name="refusable" />
        {/* <AutoField name="rules" /> */}
      </AutoForm>
    );
  }
}

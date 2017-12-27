import React from 'react';
import { AutoField, AutoForm, ListField } from 'uniforms-bootstrap3';
import RuleField from '/imports/ui/components/surveyBuilder/formFields/RuleField';
import QuestionPicker from '/imports/ui/components/surveyBuilder/formFields/QuestionPickerField';
import { QuestionDefinitionSchema } from '/imports/api/surveys/definitionSchemas';
import { handleItemTransform } from './helpers';


export default class QuestionItemForm extends React.Component {
  render() {
    const category = this.props.model.category;
    const choiceFields = category === 'choice' ?
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

    const showMask = category === 'text' || category === 'number';
    const { isInFormBuilder } = this.props;

    return (
      <AutoForm
        schema={QuestionDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
        modelTransform={handleItemTransform}
      >
        {isInFormBuilder && <AutoField name="id" />}
        {isInFormBuilder && <QuestionPicker name="hmisId" />}
        <AutoField name="type" />
        <AutoField name="title" />
        <AutoField name="category" />
        {choiceFields}
        {showMask &&
          <AutoField
            name="mask"
            help="9 - digit, a - char, * - digit or char, \9 - 9"
          />
        }
        <AutoField name="refusable" />
        {isInFormBuilder && <ListField
          name="rules"
          itemProps={{ component: RuleField }}
          addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Rule</span>}
          removeIcon={<span><i className="glyphicon glyphicon-minus" /> Delete Rule</span>}
        />}
      </AutoForm>
    );
  }
}

QuestionItemForm.defaultProps = {
  isFormBuilder: true,
};

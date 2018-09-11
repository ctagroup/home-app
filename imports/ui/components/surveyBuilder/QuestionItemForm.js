import React from 'react';
import { AutoField, AutoForm, ListField } from 'uniforms-bootstrap3';
import RuleField from '/imports/ui/components/surveyBuilder/formFields/RuleField';
import QuestionPicker from '/imports/ui/components/surveyBuilder/formFields/QuestionPickerField';
import { QuestionDefinitionSchema } from '/imports/api/surveys/definitionSchemas';
import { handleItemTransform } from './helpers';


export default class QuestionItemForm extends React.Component {
  render() {
    const isDisabled = !!this.props.model.hmisId && !!this.props.model.enrollment;
    const category = this.props.model.category;
    const choiceFields = category === 'choice' ?
      (<div className="panel panel-default">
        <div className="panel-heading">Choice</div>
        <div className="panel-body">
          <AutoField name="options" disabled={isDisabled} />
          <AutoField
            name="other"
            label="Add 'Other' option"
            disabled={isDisabled}
          />
        </div>
      </div>) : null;

    const showMask = category === 'text' || category === 'number';
    const { isInFormBuilder, questions } = this.props;


    return (
      <AutoForm
        schema={QuestionDefinitionSchema}
        onChange={this.props.onChange}
        model={this.props.model}
        modelTransform={handleItemTransform}
      >
        {isInFormBuilder && <AutoField name="id" />}
        {isInFormBuilder && <QuestionPicker name="hmisId" questions={questions} />}
        <AutoField name="type" disabled={isDisabled} />
        <AutoField name="title" />
        <AutoField name="text" />
        <AutoField name="category" disabled={isDisabled} />
        {!isDisabled && choiceFields}
        {showMask &&
          <AutoField
            name="mask"
            help="9 - digit, a - char, * - digit or char, \9 - 9"
            disabled={isDisabled}
          />
        }
        <AutoField name="refusable" disabled={isDisabled} />
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

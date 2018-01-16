import _ from 'lodash';
import React from 'react';
import GridItemForm from './GridItemForm';
import QuestionItemForm from './QuestionItemForm';
import ScoreItemForm from './ScoreItemForm';
import SectionItemForm from './SectionItemForm';
import TextItemForm from './TextItemForm';

import Grid from '/imports/ui/components/surveyForm/Grid';
import Question from '/imports/ui/components/surveyForm/Question';
import Score from '/imports/ui/components/surveyForm/Score';
import Section from '/imports/ui/components/surveyForm/Section';
import Text from '/imports/ui/components/surveyForm/Text';

export default class ItemInspector extends React.Component {
  constructor() {
    super();
    this.onInputChange = this.onInputChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      previewFormState: {
        variables: {},
        values: {},
        props: {},
      },
    };
  }

  onInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    const item = Object.assign({}, this.props.item, {
      [name]: value,
    });
    this.props.onChange(item);
  }

  onValueChange(name, value) {
    const previous = Object.assign({}, this.props.item);
    const item = Object.assign({}, this.props.item);
    _.set(item, name, value);
    this.props.onChange(item, name, previous);
  }

  isFromQuestionBank() {
    return !!this.props.originalQuestion;
  }

  handlePreviewPropsChange() {
    // console.log('handlePreviewPropsChange');
  }

  handlePreviewValueChange() {
    // console.log('handlePreviewValueChange');
  }

  renderType() {
    const item = this.props.item;
    const choices = [
      { value: 'grid', label: 'Grid' },
      { value: 'question', label: 'Question' },
      { value: 'score', label: 'Score' },
      { value: 'section', label: 'Section' },
      { value: 'text', label: 'Text' },
    ];
    return (
      <div>
        <label htmlFor="type">Type:</label>
        <select value={item.type} onChange={this.onInputChange} name="type">
          {choices.map(c => (
            <option
              key={c.value}
              value={c.value}
            >{c.label}</option>
          ))}
        </select>
      </div>
    );
  }

  renderInfo() {
    if (this.isFromQuestionBank()) {
      return (
        <p>
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;
          This is a question from Question Bank
        </p>
      );
    }
    return null;
  }

  renderOriginalTitle() {
    if (this.isFromQuestionBank()) {
      return <p><strong>Original title: </strong>{this.props.originalQuestion.title}</p>;
    }
    return null;
  }

  renderItemPreview() {
    const item = Object.assign({},
      this.props.item,
      { items: [{ type: 'text', title: '..subelements go here..' }] }
    );
    switch (item.type) {
      case 'grid':
        return (
          <Grid
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      case 'question':
        return (
          <Question
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      case 'score':
        return (
          <Score
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );

      case 'section':
        return (
          <Section
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      case 'text':
        return (
          <Text
            item={item}
            formState={this.state.previewFormState}
            onValueChange={this.handlePreviewValueChange}
            onPropsChange={this.handlePreviewPropsChange}
            level={2}
          />
        );
      default:
        return null;
    }
  }

  renderItemFields() {
    const { text, type } = this.props.item;

    const itemText = (
      <div className="form-group">
        <label htmlFor="text">Text:</label>
        <textarea
          className="form-control"
          name="text"
          placeholder="Text"
          value={text}
          onChange={this.onInputChange}
          rows={5}
        />
      </div>
    );

    return (<div>
      {[''].include(type) && itemText}
    </div>);
  }

  renderItemForm() {
    const item = this.props.item;

    switch (item.type) {
      case 'grid':
        return (<GridItemForm
          onChange={this.onValueChange}
          model={item}
          questions={this.props.questions}
          isInFormBuilder
        />);
      case 'question':
        return (<QuestionItemForm
          onChange={this.onValueChange}
          model={item}
          questions={this.props.questions}
          isInFormBuilder
        />);
      case 'score':
        return <ScoreItemForm onChange={this.onValueChange} model={item} />;
      case 'section':
        return <SectionItemForm onChange={this.onValueChange} model={item} />;
      case 'text':
        return <TextItemForm onChange={this.onValueChange} model={item} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="item-inspector">
        <h3>Item Inspector</h3>
        {this.renderItemForm()}
        <hr />
        <div className="preview section">
          {this.renderItemPreview()}
        </div>
        <button className="btn btn-default" onClick={this.props.onClose}>Close Inspector</button>
      </div>
    );
  }
}

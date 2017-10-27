import React from 'react';

import Grid from '/imports/ui/components/surveyForm/Grid';
import Question from '/imports/ui/components/surveyForm/Question';
import Score from '/imports/ui/components/surveyForm/Score';
import Section from '/imports/ui/components/surveyForm/Section';
import Text from '/imports/ui/components/surveyForm/Text';

export default class ItemInspector extends React.Component {
  constructor() {
    super();
    this.onInputChange = this.onInputChange.bind(this);
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

  handlePreviewPropsChange() {
    console.log('handlePreviewPropsChange');
  }

  handlePreviewValueChange() {
    console.log('handlePreviewValueChange');
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

  render() {
    const item = this.props.item;
    console.log(item);
    return (
      <div className="item-inspector">
        <h3>Item Inspector</h3>
        {this.renderType()}
        <div className="form-group">
          <label htmlFor="id">Id:</label>
          <input
            type="text"
            className="form-control"
            name="id"
            placeholder="ID"
            value={item.id}
            onChange={this.onInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Title"
            value={item.title}
            onChange={this.onInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Text:</label>
          <textarea
            className="form-control"
            name="text"
            placeholder="Text"
            value={item.text}
            onChange={this.onInputChange}
            rows={5}
          />
        </div>
        <hr />
        <div className="form-group">
          <label htmlFor="text">Definition:</label>
          <textarea
            className="form-control"
            readOnly
            value={JSON.stringify(item, null, 2)}
            rows={5}
          />
        </div>
        <hr />
        <h4>Item Preview</h4>
        <hr />
        <div className="preview section">
          {this.renderItemPreview()}
        </div>
      </div>
    );
  }
}

import React from 'react';
import Item from './Item';
import Grid from './Grid';
import Question from './Question';
import Score from './Score';
import Text from './Text';

export default class Section extends Item {
  constructor() {
    super();
    this.handlePropsChange = this.handlePropsChange.bind(this);
  }

  getSkipValue() {
    return !!this.props.formState.props[`${this.props.item.id}.skip`];
  }

  handlePropsChange(event) {
    this.props.onPropsChange(`${this.props.item.id}.skip`, event.target.checked);
  }

  renderSkip() {
    const skip = this.props.item.skip;
    if (!skip) {
      return null;
    }
    const skipText = typeof(skip) === 'string' ? skip : 'Skip this section';
    const checked = this.getSkipValue();
    return (
      <label>
        <input
          type="checkbox"
          onChange={this.handlePropsChange}
          checked={checked}
        />
        <span> {skipText}</span>
      </label>
    );
  }

  renderQuestion(question) {
    const { formState, level, onValueChange } = this.props;
    return (
      <Question
        key={`${question.type}:${question.id}`}
        item={question}
        level={level + 1}
        formState={formState}
        onChange={onValueChange}
      />
    );
  }

  renderGrid(grid) {
    const { formState, level, onValueChange } = this.props;
    return (
      <Grid
        key={`${grid.type}:${grid.id}`}
        item={grid}
        level={level + 1}
        formState={formState}
        onChange={onValueChange}
      />
    );
  }

  renderItems() {
    if (this.getSkipValue()) {
      return null;
    }

    const { formState, onPropsChange, onValueChange, item, level } = this.props;
    return (item.items || []).map((child) => {
      switch (child.type) {
        case 'hidden':
          return null;
        case 'section':
          return (
            <Section
              className="section item"
              key={`${child.type}:${child.id}`}
              item={child}
              formState={formState}
              onValueChange={onValueChange}
              onPropsChange={onPropsChange}
              level={level + 1}
              debugMode={this.props.debugMode}
            />);
        case 'question':
          return this.renderQuestion(child);
        case 'grid':
          return this.renderGrid(child);
        case 'score':
          return (
            <Score
              key={`${child.type}:${child.id}`}
              level={level + 1}
              item={child}
              formState={formState}
              debugMode={this.props.debugMode}
            />
          );
        case 'text':
          return (
            <Text
              key={`${child.type}:${child.id}`}
              level={level + 1}
              item={child}
              formState={formState}
            />
          );
        default:
          return (<p key={`${child.type}:${child.id}`}>Unknown item: {child.type} ({child.id})</p>);
      }
    });
  }

  render() {
    return (
      <div className="section">
        {this.renderTitle()}
        <p>{this.props.item.description}</p>
        {this.renderSkip()}
        {this.renderItems()}
      </div>
    );
  }
}

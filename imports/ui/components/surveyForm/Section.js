import React from 'react';
import Grid from './Grid';
import Question from './Question';
import Text from './Text';

export default class Section extends React.Component {
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

  renderTitle() {
    const title = this.props.item.title;
    switch (this.props.level) {
      case 1:
        return <h1>{title}</h1>;
      case 2:
        return <h2>{title}</h2>;
      case 3:
        return <h3>{title}</h3>;
      case 4:
        return <h4>{title}</h4>;
      case 5:
        return <h5>{title}</h5>;
      case 6:
        return <h6>{title}</h6>;
      default:
        return <div>{title}</div>;
    }
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
        {skipText}
      </label>
    );
  }

  renderQuestion(question) {
    const { formState, onValueChange } = this.props;
    return (
      <Question
        key={`${question.type}:${question.id}`}
        item={question}
        formState={formState}
        onChange={onValueChange}
      />
    );
  }

  renderGrid(grid) {
    const { formState, onValueChange } = this.props;
    return (
      <Grid
        key={`${grid.type}:${grid.id}`}
        item={grid}
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
        case 'section':
          return (
            <Section
              key={`${child.type}:${child.id}`}
              item={child}
              formState={formState}
              onValueChange={onValueChange}
              onPropsChange={onPropsChange}
              level={level + 1}
            />);
        case 'question':
          return this.renderQuestion(child);
        case 'grid':
          return this.renderGrid(child);
        case 'text':
          return (
            <Text
              key={`${child.type}:${child.id}`}
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
      <div>
        {this.renderTitle()}
        <p>{this.props.item.description}</p>
        {this.renderSkip()}
        {this.renderItems()}
      </div>
    );
  }
}

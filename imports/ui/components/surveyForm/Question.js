import React from 'react';

export default class Question extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onChange(this.props.item.id, event.target.value);
  }

  render() {
    const { id, title, text, required } = this.props.item;
    const isDisabled = this.props.formState.variables[`${id}.disabled`];
    return (
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        <input
          type="text"
          id={id}
          name={id}
          value={this.props.value}
          onChange={this.handleChange}
          disabled={isDisabled}
          required={required}
        />
      </div>
    );
  }
}

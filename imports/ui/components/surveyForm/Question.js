import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Item from './Item';

const DEFAULT_OTHER_VALUE = 'Other';

export default class Question extends Item {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleOtherFocus = this.handleOtherFocus.bind(this);
    this.handleOtherClick = this.handleOtherClick.bind(this);
    this.state = {
      otherSelected: false,
    };
  }

  getRefuseValue() {
    const refusable = this.props.item.refusable;
    if (!refusable) {
      return null;
    }
    const refuseValue = typeof(refusable) === 'boolean' ? 'Refused' : refusable;
    return refuseValue;
  }

  handleChange(event, date) {
    let value;
    try {
      // handle refused checkbox
      if (event.target.attributes.rel.value === 'refuse') {
        if (event.target.checked) {
          value = this.getRefuseValue();
          this.setState({ otherSelected: false });
        } else {
          value = '';
        }
      }
    } catch (e) {
      // handle value change
      let number;
      switch (this.props.item.category) {
        case 'choice':
          value = event.target.value;
          if (this.props.item.options.includes(value)) {
            this.setState({ otherSelected: false });
          }
          break;
        case 'date':
          value = date ? date.format('YYYY-MM-DD') : '';
          break;
        case 'number':
          value = event.target.value;
          if (value.length > 0) {
            number = parseInt(value, 10);
            value = isNaN(number) ? 0 : number;
          }
          break;
        default:
          value = event.target.value;
          break;
      }
    }

    if (!value && this.state.otherSelected) {
      value = DEFAULT_OTHER_VALUE;
    }
    this.props.onChange(this.props.item.id, value);
  }

  handleOtherClick(event) {
    this.props.onChange(event.target.name, event.target.value);
    this.otherInput.focus();
  }

  handleOtherFocus() {
    setTimeout(() => this.setState({ otherSelected: true }), 1);
  }

  isRefused() {
    return this.props.formState.values[this.props.item.id] === this.getRefuseValue();
  }

  renderQuestionCategory(value, disabled) {
    switch (this.props.item.category) {
      case 'date':
        return this.renderDatePicker(value, disabled);
      case 'choice':
        return this.renderChoice(value, disabled);
      case 'number':
        return this.renderInput(value, 'number', disabled);
      default:
        return this.renderInput(value, 'text', disabled);
    }
  }

  renderDatePicker(value, disabled) {
    return (
      <DatePicker
        selected={value ? moment(value) : ''}
        onChange={(v, e) => this.handleChange(e, v)}
        placeholderText="MM/DD/YYYY"
        disabled={this.isRefused() || disabled}
      />
    );
  }

  renderChoice(value, disabled) {
    const { id, options, other } = this.props.item;
    const choices = (options || []).map(v => (
      <div key={`choice-${id}-${v}`}>
        <label>
          <input
            type="radio"
            name={id}
            value={v}
            disabled={this.isRefused() || disabled}
            checked={!this.isRefused() && v === value}
            onChange={this.handleChange}
          /> {v}
        </label>
      </div>
    ));
    if (other) {
      const otherValue = options.concat([DEFAULT_OTHER_VALUE]).includes(value) ? '' : value;
      const otherPlaceholder = typeof(other) === 'boolean' ? 'please specify' : `${other}`;
      const checked = !this.isRefused() && this.state.otherSelected;
      choices.push(
        <div key={`choice-${id}-other`}>
          <label>
            <input
              name={id}
              type="radio"
              disabled={this.isRefused() || disabled}
              checked={checked}
              value={DEFAULT_OTHER_VALUE}
              onChange={this.handleOtherClick}
            /> <span>Other: </span>
            <input
              type="text"
              name={id}
              placeholder={otherPlaceholder}
              disabled={this.isRefused() || disabled}
              value={otherValue || ''}
              onChange={this.handleChange}
              onFocus={this.handleOtherFocus}
              ref={(input) => { this.otherInput = input; }}
            />
          </label>
        </div>
      );
    }
    return (
      <div>
        {choices}
      </div>
    );
  }

  renderInput(value, type, disabled) {
    const { id } = this.props.item;
    return (
      <input
        type={type}
        id={id}
        name={id}
        value={value === undefined ? '' : value}
        onChange={this.handleChange}
        disabled={this.isRefused() || disabled}
      />
    );
  }

  renderRefuseCheckbox(disabled) {
    const refuseValue = this.getRefuseValue();
    if (!refuseValue) {
      return null;
    }
    return (
      <span> <label>
        <input
          type="checkbox"
          value={refuseValue}
          rel="refuse"
          onChange={this.handleChange}
          checked={this.isRefused()}
          disabled={disabled}
        />
        <span> {refuseValue}</span>
      </label></span>
    );
  }


  render() {
    const { id, text } = this.props.item;
    const value = this.props.formState.values[id];
    const disabled = this.props.formState.props[`${id}.skip`];
    return (
      <div className="question item">
        {this.renderTitle()}
        <div className="text">{text}</div>
        {this.renderQuestionCategory(this.isRefused() ? '' : value, disabled)}
        {this.renderRefuseCheckbox(disabled)}
      </div>
    );
  }
}

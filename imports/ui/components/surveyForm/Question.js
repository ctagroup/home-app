import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

export default class Question extends React.Component {
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
        value = event.target.checked ? this.getRefuseValue() : '';
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
          number = parseInt(value, 10);
          value = isNaN(number) ? 0 : number;
          break;
        default:
          value = event.target.value;
          break;
      }
    }
    this.props.onChange(this.props.item.id, value);
  }

  handleOtherClick() {
    this.otherInput.focus();
  }

  handleOtherFocus() {
    setTimeout(() => this.setState({ otherSelected: true }), 1);
  }

  isRefused() {
    return this.props.formState.values[this.props.item.id] === this.getRefuseValue();
  }

  renderQuestionCategory(value) {
    switch (this.props.item.category) {
      case 'date':
        return this.renderDatePicker(value);
      case 'choice':
        return this.renderChoice(value);
      case 'number':
        return this.renderInput(value, 'number');
      default:
        return this.renderInput(value, 'text');
    }
  }

  renderDatePicker(value) {
    return (
      <DatePicker
        selected={value ? moment(value) : ''}
        onChange={(v, e) => this.handleChange(e, v)}
        placeholderText="MM/DD/YYYY"
        disabled={this.isRefused()}
      />
    );
  }

  renderChoice(value) {
    const { id, options, other } = this.props.item;
    const choices = options.map(v => (
      <div key={`choice-${id}-${v}`}>
        <label>
          <input
            type="radio"
            name={id}
            value={v}
            disabled={this.isRefused()}
            checked={!this.isRefused() && v === value}
            onChange={this.handleChange}
          /> {v}
        </label>
      </div>
    ));
    if (other) {
      const otherValue = options.includes(value) ? '' : value;
      const checked = !this.isRefused() && this.state.otherSelected;
      choices.push(
        <div key={`choice-${id}-other`}>
          <label>
            <input
              name={id}
              type="radio"
              disabled={this.isRefused()}
              checked={checked}
              onChange={this.handleOtherClick}
            /> <span>Other: </span>
            <input
              type="text"
              name={id}
              placeholder="please specify"
              disabled={this.isRefused()}
              value={otherValue || ''}
              onChange={this.handleChange}
              onFocus={this.handleOtherFocus}
              ref={(input) => { this.otherInput = input; }}
            />
            {`${this.state.otherSelected} ${checked}`}
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

  renderInput(value, type) {
    const { id } = this.props.item;
    return (
      <input
        type={type}
        id={id}
        name={id}
        value={value || ''}
        onChange={this.handleChange}
        disabled={this.isRefused()}
      />
    );
  }

  renderRefuseCheckbox() {
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
        />
        <span> {refuseValue}</span>
      </label></span>
    );
  }


  render() {
    const { id, title, text } = this.props.item;
    const value = this.props.formState.values[id];
    return (
      <div className="question">
        <div className="title">{title}</div>
        <em>{text}</em>
        {this.renderQuestionCategory(this.isRefused() ? '' : value)}
        {this.renderRefuseCheckbox()}
      </div>
    );
  }
}

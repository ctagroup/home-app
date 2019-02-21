import React from 'react';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import CurrencyInput from '/imports/ui/components/CurrencyInput';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Item from './Item';
import { isNumeric, getLatLongFromDevice, createGeocodeUrl } from '/imports/api/utils';
import { logger } from '/imports/utils/logger';

const DEFAULT_OTHER_VALUE = 'Other';

export const MISSING_HMIS_ID_ICON = <i className="fa fa-exclamation-circle" aria-hidden></i>;

export default class Question extends Item {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleRefuseChange = this.handleRefuseChange.bind(this);
    this.handleOtherFocus = this.handleOtherFocus.bind(this);
    this.handleOtherClick = this.handleOtherClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = {
      otherSelected: false,
      error: null,
    };
  }

  getChoiceOptions() {
    const options = this.props.item.options || [];
    if (Array.isArray(options)) {
      return options.filter(o => !!o).map(o => {
        if (typeof o === 'string') {
          const label = o.split('|').pop();
          const value = o.split('|').shift();
          return {
            value,
            label,
          };
        }
        return {
          value: o,
          label: o,
        };
      });
    }
    return Object.keys(options).map(key => ({
      value: key,
      label: options[key],
    }));
  }

  getRefuseValue() {
    const refusable = this.props.item.refusable;
    if (!refusable) {
      return null;
    }
    const refuseValue = typeof(refusable) === 'boolean' ? 'Refused' : refusable;
    return refuseValue;
  }

  getAddressValue() {
    const fields = document.getElementsByName('addressInput');
    const values = Array.prototype.map.call(fields, f => f.value);
    return values.join(',');
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
      const choiceOptions = this.getChoiceOptions();
      switch (this.props.item.category) {
        case 'choice':
        case 'select':
          value = event.target.value;
          if (choiceOptions.some(o => o.value === value)) {
            this.setState({ otherSelected: false });
          }
          break;
        case 'date':
          value = date ? date.format('YYYY-MM-DD') : '';
          break;
        default:
          value = event.target.value;
          break;
      }
    }

    if (!value && this.state.otherSelected) {
      value = DEFAULT_OTHER_VALUE;
    }

    const isValid = this.validateValue(value);

    this.props.onChange(this.props.item.id, value, isValid);
  }

  handleRefuseChange(event) {
    this.handleChange(event);
  }

  handleOtherClick(event) {
    this.props.onChange(event.target.name, event.target.value);
    this.otherInput.focus();
  }

  handleOtherFocus() {
    setTimeout(() => this.setState({ otherSelected: true }), 1);
  }

  validateValue(value) {
    const isRefused = this.getRefuseValue() === value;
    if (this.props.item.category === 'number' && !isRefused) {
      if (value.length > 0) {
        if (!isNumeric(value)) {
          this.setState({ error: `${value} is not a number` });
          return false;
        }
      }
    }
    this.setState({ error: null });
    return true;
  }

  handleButtonClick() {
    if (this.props.item.category === 'location') {
      const addressFields = this.props.item.addressFields || [];
      const value = this.getAddressValue();
      let addressType = 'address';
      for (let i = 0; i < addressFields.length; i++) {
        const addLwrCase = addressFields[i].toLowerCase();
        // TODO: This basically means the address fields have to be exclusively
        // Long/Lat or address. No combinations.
        if (addLwrCase.includes('lat') || addLwrCase.includes('long')) {
          addressType = 'coords';
          break;
        }
      }
      if (value.length > 0) {
        const url = createGeocodeUrl(value, addressType);
        return new Promise((resolve) => {
          Meteor.call('surveys.getGeocodedLocation', url, (error, result) => {
            if (error) {
              const msg = 'Location could not be validated due the API call returning an error.';
              this.setState({ error: null, message: msg });
              logger.info(msg);
              resolve(false);
            } else {
              // We're assuming the location is valid if the geocoding API result isn't empty
              // In the future we may want to populate address fields based on the result
              if (result.results && result.results.length > 0) {
                const msg = `\"${value}\" validated successfully.`;
                this.setState({ error: null, message: msg });
                logger.info(msg);
                resolve(true);
              } else {
                const msg = `\"${value}\" did not validate successfully.`;
                this.setState({ error: null, message: msg });
                logger.info(msg);
                resolve(false);
              }
              if (result.rate) {
                // Log remaining requests, OpenCage Geocoder API allows 2500/day
                const geoLimitMsg =
                  `You have ${result.rate.remaining}/${result.rate.limit} remaining ` +
                  'requests to OpenCage Geocoder API today.';
                logger.info(geoLimitMsg);
              }
            }
          });
        });
      }
    }
    return false;
  }

  isRefused() {
    return this.props.formState.values[this.props.item.id] === this.getRefuseValue();
  }

  renderQuestionCategory(value, disabled) {
    switch (this.props.item.category) {
      case 'choice':
        return this.renderChoice(value, disabled);
      case 'currency':
        return this.renderCurrencyInput(value, disabled);
      case 'location':
        return this.renderLocationInput(value, disabled);
      case 'date':
        return this.renderDatePicker(value, disabled);
      case 'number':
        return this.renderNumberInput(value, disabled);
      case 'select':
        return this.renderSelect(value, disabled);
      case 'textarea':
        return this.renderTextarea(value, disabled);
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
    const { id, other } = this.props.item;
    const options = this.getChoiceOptions();
    const choices = options.map((v, i) => (
      <div key={`choice-${id}-${i}`}>
        <label>
          <input
            type="radio"
            name={id}
            value={v.value}
            disabled={this.isRefused() || disabled}
            checked={!this.isRefused() && v.value == value} // eslint-disable-line
            onChange={this.handleChange}
          />
          {'\xa0'}
          {v.label}
        </label>
      </div>
    ));
    if (other) {
      const optionsWithOther = [...options, { value: 'Other', label: value }];
      const otherValue = optionsWithOther.some(o => o.value === value)
        ? ''
        : value;
      const otherPlaceholder =
        typeof other === 'boolean' ? 'please specify' : `${other}`;
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
            />
            {'\xa0'}
            <span>Other: </span>
            <input
              type="text"
              name={id}
              placeholder={otherPlaceholder}
              disabled={this.isRefused() || disabled}
              value={otherValue || ''}
              onChange={this.handleChange}
              onFocus={this.handleOtherFocus}
              ref={input => {
                this.otherInput = input;
              }}
            />
          </label>
        </div>
      );
    }
    return <div>{choices}</div>;
  }

  renderSelect(value, disabled) {
    const { id, other } = this.props.item;
    const options = this.getChoiceOptions();
    const htmlOptions = options.map((v, i) => (
      <option
        key={`choice-${id}-${i}`}
        value={v.value}
      >
        {v.label}
      </option>
    ));

    let otherOption = null;
    if (other) {
      const otherValue = [...options, { value: 'Other' }].some(o => o.value === value) ? '' : value;
      const otherPlaceholder = typeof(other) === 'boolean' ? 'please specify' : `${other}`;
      const otherChecked = !this.isRefused() && this.state.otherSelected;
      otherOption = (
        <div>
          <input
            name={id}
            type="checkbox"
            disabled={this.isRefused() || disabled}
            checked={otherChecked}
            value={DEFAULT_OTHER_VALUE}
            onChange={this.handleOtherClick}
          />
          <span>Other: </span>
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
        </div>
      );
    }
    return (
      <div>
        <select
          id={id}
          value={value}
          disabled={this.isRefused() || disabled}
          onChange={this.handleChange}
        >
          <option value="">--- Please select ---</option>
          {htmlOptions}
        </select>
        {otherOption}
      </div>
    );
  }


  renderInput(value, type, disabled) {
    const { id } = this.props.item;
    const mask = this.props.item.mask;
    return (
      <InputMask
        type={type}
        id={id}
        name={id}
        mask={mask}
        value={value === undefined ? '' : value}
        onChange={this.handleChange}
        disabled={this.isRefused() || disabled}
      />
    );
  }

  renderTextarea(value, disabled) {
    const { id } = this.props.item;
    return (
      <textarea id={id} disabled={disabled} rows={5}>{value}</textarea>
    );
  }

  renderCurrencyInput(value, disabled) {
    const { id } = this.props.item;

    return (
      <CurrencyInput
        id={id}
        value={value === undefined ? '0' : value}
        onChange={(x, number) =>
          this.props.onChange(this.props.item.id, number)
        }
        disabled={this.isRefused() || disabled}
      />
    );
  }

  renderNumberInput(value, disabled) {
    const { id } = this.props.item;
    const mask = this.props.item.mask;
    return (
      <InputMask
        id={id}
        name={id}
        mask={mask}
        value={value === undefined ? '' : value}
        onChange={this.handleChange}
        disabled={this.isRefused() || disabled}
      />
    );
  }

  renderLocationInput(value, disabled) {
    const { id } = this.props.item;
    const addressFields = this.props.item.addressFields || [];
    const autoLoc = this.props.item.autoLocation;
    // const longLatCheck = this.props.item.longLatCheck;
    let location;
    if (autoLoc) {
      const latLongVal = getLatLongFromDevice();
      location = (
        <table>
          <tr>
            <td>Latitude: </td>
            <td> </td>
            <td>{latLongVal[0]}</td>
          </tr>
          <tr>
            <td>Longitude: </td>
            <td> </td>
            <td>{latLongVal[1]}</td>
          </tr>
        </table>
      );
    } else {
      let tempLoc = addressFields.map((v, i) => (
        <tr>
          <td>{v} </td>
          <td>
            <input
              id={`address-${i}`}
              type="text"
              name="addressInput"
              disabled={this.isRefused() || disabled}
              onChange={this.handleChange}
            />
          </td>
        </tr>
      ));
      location = (
        <table>
          {tempLoc}
          <tr>
            <button
              id="addressValidation"
              className="btn btn-default"
              type="button"
              onClick={this.handleButtonClick}
              disabled={this.isRefused() || disabled}
            >
              Validate Address
            </button>
          </tr>
        </table>
      );
    }
    return <div key={`location-${id}`}>{location}</div>;
  }

  renderRefuseCheckbox(disabled) {
    const refuseValue = this.getRefuseValue();
    if (!refuseValue) {
      return null;
    }
    return (
      <span>
        <label>
          <input
            type="checkbox"
            value={refuseValue}
            rel="refuse"
            onChange={this.handleRefuseChange}
            checked={this.isRefused()}
            disabled={disabled}
          />
          <span> {refuseValue}</span>
        </label>
      </span>
    );
  }

  renderTitle() {
    const icon = this.props.item.hmisId ? null : MISSING_HMIS_ID_ICON;
    const title = `${this.props.item.title}`;
    switch (this.props.level) {
      case 1:
        return (
          <h1 className="title">
            {title} {icon}
          </h1>
        );
      case 2:
        return (
          <h2 className="title">
            {title} {icon}
          </h2>
        );
      case 3:
        return (
          <h3 className="title">
            {title} {icon}
          </h3>
        );
      case 4:
        return (
          <h4 className="title">
            {title} {icon}
          </h4>
        );
      case 5:
        return (
          <h5 className="title">
            {title} {icon}
          </h5>
        );
      case 6:
        return (
          <h6 className="title">
            {title} {icon}
          </h6>
        );
      default:
        return (
          <div className="title">
            {title} {icon}
          </div>
        );
    }
  }

  render() {
    const { id, text } = this.props.item;
    const value = this.props.formState.values[id];
    const disabled = this.props.formState.props[`${id}.skip`];
    const hasError = !!this.state.error;

    if (disabled && value) {
      // if field is disable but has a value, emit an evet to clear the field
      this.props.onChange(id, '', true);
    }

    return (
      <div
        className={`question item ${hasError ? 'error' : ''} ${
          disabled ? 'disabled' : ''
        }`}
      >
        {this.renderTitle()}
        <div className="text">{text}</div>
        {this.renderQuestionCategory(this.isRefused() ? '' : value, disabled)}
        {this.renderRefuseCheckbox(disabled)}
        {hasError && <div className="error-message">{this.state.error}</div>}
      </div>
    );
  }
}

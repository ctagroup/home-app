import React, { Component } from 'react';
import curr from 'currency.js';
// import PropTypes from 'prop-types';
// import { hardCopyObject, formatCurrency } from './utils';

/*
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    currency: PropTypes.string,
    currencyConfiguration: PropTypes.shape({
      symbol: PropTypes.string,
      precision: PropTypes.number,
      decimal: PropTypes.string,
      separator: PropTypes.string,
    }),
    showSymbol: PropTypes.bool,
    spaceSymbol: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    className: '',
    style: {},
    currency: 'BRL',
    currencyConfiguration: hardCopyObject(brlConfiguration),
    showSymbol: false,
    spaceSymbol: false,
    onChange: Function.prototype,
  }
*/

const formatCurrency = (value = 0, code = 'USD', displayOptions = {}) => {
  const config = {
    symbol: '$',
    precision: 2,
    decimal: '.',
    separator: ',',
  };

  if (!config) {
    throw new Error(`You need to provide a currencyConfiguration for currency code ${code}.`);
  }

  const { showSymbol, spaceSymbol } = displayOptions;

  if (spaceSymbol) {
    config.symbol += ' ';
  }
  return curr(value, config).format(showSymbol);
};


class CurrencyInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      maskedValue: '0,00',
    };
    this.initialState = {
      value: 0,
      maskedValue: '0,00',
    };
    this.handleChange = this.handleChange.bind(this);
    this.setInitialValues = this.setInitialValues.bind(this);
    this.maskValue = this.maskValue.bind(this);
  }

  componentDidMount() {
    this.setInitialValues();
  }

  componentDidUpdate(prevProps) {
    const { defaultValue: prevGivenDefaultValue } = prevProps;
    const { defaultValue: givenDefaultValue } = this.props;

    if (givenDefaultValue !== prevGivenDefaultValue) {
      this.setInitialValues();
    }
  }

  setInitialValues() {
    const { value: givenValue, defaultValue: givenDefaultValue } = this.props;

    const value = givenValue || givenDefaultValue;
    const maskedValue = this.maskValue(value);

    this.setState({
      value,
      maskedValue,
    });
  }

  handleChange(event) {
    const { target } = event;
    const { value: inputValue = 0 } = target;
    const { onChange } = this.props;

    const value = this.unmaskValue(inputValue);
    const maskedValue = this.maskValue(value);

    this.setState({
      value,
      maskedValue,
    });

    if (!onChange || typeof onChange !== 'function') {
      return false;
    }

    console.log(value, maskedValue);

    return onChange(event, value, maskedValue);
  }

  maskValue(value = 0) {
    const {
      currency,
      showSymbol,
      spaceSymbol,
    } = this.props;

    return formatCurrency(value, currency, {
      showSymbol,
      spaceSymbol,
    });
  }

  unmaskValue(maskedValue = '') {
    return parseInt(maskedValue.replace(/\D/g, '') || 0, 10) / 100;
  }

  render() {
    const { name: inputName, className, style } = this.props;
    const { maskedValue } = this.state;

    return (
      <input
        type="tel"
        className={className}
        style={style}
        name={inputName}
        value={maskedValue}
        onChange={this.handleChange}
      />
    );
  }
}

export default CurrencyInput;

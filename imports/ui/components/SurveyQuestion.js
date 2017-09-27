import React from 'react';

export default class SurveyQuestion extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    this.evaluateRules();
  }

  evaluateRules() {
    const rules = this.props.question.rules || [];
    const values = this.props.values;
    for (let i = 0; i < rules.length; i++) {
      const result = this.evaluateRule(rules[i], values);
      console.log('rule fired', result);

      /*
      switch (result) {
        case 'show':
          return true;
        case 'hide':
          return false;
        default:
          break;
      }
      */
    }
    return true;
  }

  evaluateRule(rule, values) {
    let value;
    if (rule.question) {
      const id = rule.question;
      value = values.questions[id];
    } else if (rule.client) {
      const id = rule.client;
      value = values.client[id];
    }

    if (rule.otherwise) {
      return rule.otherwise;
    } else if (rule.any.length > 0) {
      for (let i = 0; i < rule.any.length; i++) {
        if (this.evaluateCondition(rule.any[i], value) === true) {
          return rule.then;
        }
      }
    } else if (rule.all.length > 0) {
      for (let i = 0; i < rule.all.length; i++) {
        let result = true;
        if (this.evaluateCondition(rule.any[i], value) === false) {
          result = false;
          break;
        }
        if (result) {
          return rule.then;
        }
      }
    }
    return false;
  }

  evaluateCondition(condition, operand1) {
    const operator = condition[0];
    const operand2 = condition[1];
    switch (operator) {
      case '==':
        return operand1 == operand2; // eslint-disable-line eqeqeq
      case '!=':
        return operand1 != operand2; // eslint-disable-line eqeqeq
      case '<':
        return operand1 < operand2;
      case '>':
        return operand1 > operand2;
      case '<=':
        return operand1 <= operand2;
      case '>=':
        return operand1 >= operand2;
      default:
        console.warn('Unknown operator', operator);
        return undefined;
    }
  }



  handleChange(event) {
    this.props.onChange(this.props.question.id, event.target.value);
  }

  render() {
    const isDisabled = !this.state.visible;
    const { id, title, required } = this.props.question;
    return (
      <div>
        <h3>{title} {id}</h3>
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

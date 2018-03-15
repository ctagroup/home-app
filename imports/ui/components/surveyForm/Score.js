import React from 'react';
import { evaluateOperand } from '/imports/api/surveys/computations';
import Text from './Text';

export default class Score extends Text {
  render() {
    const { score, text } = this.props.item;
    let value = evaluateOperand(score, this.props.formState) || 0;
    console.log(this.props.debugMode);

    return this.props.debugMode ? (
      <div className="score item">
        <div className="wrapper">
          <div className="text">SCORE:</div>
          <div className="value">{value}</div>
        </div>
        <div className="text" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    ) : null;
  }
}

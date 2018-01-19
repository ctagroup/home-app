import React from 'react';
import { evaluateOperand } from '/imports/api/surveys/computations';
import Item from './Item';

export default class Text extends Item {
  parseText(text) {
    const regex = /{{([^}]+)}}/g;
    const translations = {};
    let out = text;
    while (true) {
      const m = regex.exec(text);
      if (m === null) {
        break;
      }
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      m.forEach((match, groupIndex, data) => {
        if (groupIndex === 0) {
          translations[match] = data[1];
        }
      });
    }
    Object.keys(translations).forEach(t => {
      const value = evaluateOperand(translations[t], this.props.formState, 'n/a');
      out = out.split(t).join(`${value}`);
    });
    return out;
  }

  render() {
    const { id, title, text } = this.props.item;
    const isDisabled = this.props.formState.variables[`${id}.disabled`];

    if (isDisabled) {
      return null;
    }

    return (
      <div className="text item">
        {this.renderTitleHTML(this.parseText(title))}
        <div dangerouslySetInnerHTML={{ __html: this.parseText(text) }} />
      </div>
    );
  }
}

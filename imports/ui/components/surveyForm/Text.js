import React from 'react';
import { getValueByPath } from '/imports/api/surveys/computations';

export default class Text extends React.Component {
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
      console.log(t, translations[t]); // split-join
    });
    return text;
  }

  render() {
    const { id, title, text } = this.props.item;
    const isDisabled = this.props.formState.variables[`${id}.disabled`];

    if (isDisabled) {
      return null;
    }

    return (
      <div>
        <h3>{title}</h3>
        <p>{this.parseText(text)}</p>
      </div>
    );
  }
}

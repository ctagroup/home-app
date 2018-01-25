import React from 'react';
import { SelectField, TextField } from 'uniforms-bootstrap3';
import connectField from 'uniforms/connectField';


function conditionDefinition(condition) {
  switch (condition) {
    case 'isset':
      return {
        label: 'isset',
        argPrefixes: [':'],
        argPlaceholders: ['variable'],
        numArgs: 1,
      };
    case '==':
      return {
        label: 'equals',
        argPrefixes: [':', '=='],
        argPlaceholders: ['variable', 'val/var'],
        numArgs: 2,
      };
    case '!=':
      return {
        label: 'not equal',
        argPrefixes: [':', '<>'],
        argPlaceholders: ['variable', 'val/var'],
        numArgs: 2,
      };
    case '<':
      return {
        label: 'less than',
        argPrefixes: [':', '<'],
        argPlaceholders: ['variable', 'val/var'],
        numArgs: 2,
      };
    case '<=':
      return {
        label: 'less than or equal',
        argPrefixes: [':', '<='],
        argPlaceholders: ['variable', 'val/var'],
        numArgs: 2,
      };
    case '>':
      return {
        label: 'greater than',
        argPrefixes: [':', '>'],
        argPlaceholders: ['variable', 'val/var'],
        numArgs: 2,
      };
    case '>=':
      return {
        label: 'greater than or equal',
        argPrefixes: [':', '>='],
        argPlaceholders: ['variable', 'val/var'],
        numArgs: 2,
      };
    default:
      return {
        label: condition,
        numArgs: 0,
      };
  }
}


class ConditionField extends React.Component {
  render() {
    let fields = [];
    const condition = this.props.value[0];
    const definition = conditionDefinition(condition);

    fields.push(
      <SelectField
        className="inline"
        key={`${this.props.name}.0`}
        name={`${this.props.name}.0`}
        value={condition}
        label="condition"
        allowedValues={['isset', '==', '!=', '<', '<=', '>', '>=']}
        transform={v => conditionDefinition(v).label}
        placeholder="--- select ---"
      />
    );

    for (let i = 0; i < definition.numArgs; i++) {
      const idx = fields.length;
      const prefix = definition.argPrefixes[i];
      fields.push(
        <div className="inline" key={`${this.props.name}.${idx}`}>
          {!!prefix && <span className="field-prefix">{prefix}</span>}
          <TextField
            name={`${this.props.name}.${idx}`}
            value={this.props.value[idx] || ''}
            label={definition.argPlaceholders[i]}
          />
        </div>
      );
    }

    return (
      <div className="condition-field-group col-xs-11">
        {fields}
        <div className="debug">{JSON.stringify(this.props.value)}</div>
      </div>
    );
  }
}

export default connectField(ConditionField, { includeInChain: false });

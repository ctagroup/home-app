import React from 'react';
import { SelectField, TextField } from 'uniforms-bootstrap3';
import connectField from 'uniforms/connectField';

function actionDefinition(action) {
  switch (action) {
    case 'show':
      return {
        label: 'show this item',
        numArgs: 0,
      };
    case 'hide':
      return {
        label: 'hide this item',
        numArgs: 0,
      };
    case 'rows':
      return {
        label: 'set # of rows',
        numArgs: 0,
      };
    case 'set':
      return {
        label: 'set form variable',
        argPlaceholders: ['var', 'val/var'],
        argPrefixes: [':', ' = '],
        numArgs: 2,
      };
    case 'pset':
      return {
        label: 'set item property',
        argPlaceholders: ['var', 'val/var'],
        argPrefixes: [':', ' = '],
        numArgs: 2,
      };
    case 'add':
      return {
        label: 'increment variable',
        argPlaceholders: ['var', 'val/var'],
        argPrefixes: [':', ' by'],
        numArgs: 2,
      };
    case 'sum':
      return {
        label: 'sum numbers',
        argPlaceholders: ['variable', 'val/var #1', 'val/var #2'],
        argPrefixes: [':', '=', '+'],
        numArgs: 3,
        infiniteArgs: i => ({ prefix: '+', label: `val/var #${i - 1}` }),
      };
    default:
      return {
        label: action,
        numArgs: 0,
      };
  }
}


class ActionField extends React.Component {
  render() {
    let fields = [];
    const action = this.props.value[0];
    const definition = actionDefinition(action);

    fields.push(
      <SelectField
        className="inline"
        key={`${this.props.name}.0`}
        name={`${this.props.name}.0`}
        value={action}
        label="action"
        allowedValues={['show', 'hide', 'set', 'pset', 'add', 'sum', 'rows']}
        transform={v => actionDefinition(v).label}
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

    if (definition.infiniteArgs) {
      for (let i = fields.length; i < this.props.value.length + 1; i++) {
        const idx = fields.length;
        const prefix = definition.infiniteArgs(i).prefix;
        const label = definition.infiniteArgs(i).label;
        fields.push(
          <div className="inline" key={`${this.props.name}.${idx}`}>
            {!!prefix && <span className="field-prefix">{prefix}</span>}
            <TextField
              name={`${this.props.name}.${idx}`}
              value={this.props.value[idx]}
              label={label}
            />
          </div>
        );
      }
    }

    return (
      <div className="action-field-group col-xs-11">
        {fields}
        <div className="debug">{JSON.stringify(this.props.value)}</div>
      </div>
    );
  }
}

export default connectField(ActionField, { includeInChain: false });

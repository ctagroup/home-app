import React from 'react';
import { AutoField, NestField } from 'uniforms-bootstrap3';
import connectField from 'uniforms/connectField';
import ActionField from './RuleActionField';
import ConditionField from './RuleConditionField';


class RuleField extends React.Component {
  render() {
    const value = Object.keys(this.props.value)[0] || 'any';

    let typePrefix;
    let typeSuffix;
    switch (value) {
      case 'any':
        typePrefix = 'If ';
        typeSuffix = ' of the conditions is satisfied';
        break;
      case 'all':
        typePrefix = 'If ';
        typeSuffix = ' all conditions are satisfied';
        break;
      default:
        typePrefix = 'Do ';
        typeSuffix = '';
        break;
    }
    return (
      <NestField className="rule-field" name={this.props.name} value={value} label="Rule">
        <div className="col-xs-11">
          {typePrefix}
          <AutoField className="inline" name="type" label={false} value={value} />
          {typeSuffix}

          {value === 'all' && <AutoField
            name="all"
            itemProps={{ component: ConditionField }}
            addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Condition</span>}
          />}

          {value === 'any' && <AutoField
            name="any"
            itemProps={{ component: ConditionField }}
            addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Condition</span>}
          />}

          {(value === 'all' || value === 'any') && <AutoField
            name="then"
            itemProps={{ component: ActionField }}
            addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Action</span>}
          />}

          {value === 'always' && <AutoField
            name="always"
            itemProps={{ component: ActionField }}
            label="Actions"
            addIcon={<span><i className="glyphicon glyphicon-plus" /> Add Action</span>}
          />}
        </div>
      </NestField>
    );
  }
}

export default connectField(RuleField, { includeInChain: false });

import React from 'react';
import { AutoField } from 'uniforms-bootstrap3';
import connectField from 'uniforms/connectField';


class ConditionField extends React.Component {
  render() {
    return (
      <AutoField name={this.props.name} value={this.props.value} label="Condition parametes" />
    );
  }
}

export default connectField(ConditionField, { includeInChain: false });

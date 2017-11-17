import React from 'react';
import { AutoField } from 'uniforms-bootstrap3';
import connectField from 'uniforms/connectField';


class ActionField extends React.Component {
  render() {
    return (
      <AutoField name={this.props.name} value={this.props.value} label="Action parameters" />
    );
  }
}

export default connectField(ActionField, { includeInChain: false });

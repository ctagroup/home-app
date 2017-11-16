import React from 'react';
import AutoField from 'uniforms-bootstrap3/AutoField';
import connectField from 'uniforms/connectField';

class RuleField extends React.Component {
  render() {
    console.log('rf', this.props.value);
    const value = this.props.value.type;
    return (
      <div className="col-xs-11">
        <AutoField name="type" label="" value={value} />
      </div>
    );
  }
}

export default connectField(RuleField);

import React from 'react';
import AutoField from 'uniforms-bootstrap3/AutoField';
import connectField from 'uniforms/connectField';

const VariableField = () =>
  <div className="col-xs-11">
    <div className="col-xs-8">
      <AutoField name="name" label="" placeholder="variable name" />
    </div>
    <div className="col-xs-4">
      <AutoField name="value" label="" placeholder="initial value" />
    </div>
  </div>
;

export default connectField(VariableField);

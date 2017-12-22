import React from 'react';
import connectField from 'uniforms/connectField';


class QuestionPickerField extends React.Component {
  constructor() {
    super();
    this.state = {
      opened: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.props.onChange(123);
  }

  render() {
    return (
      <div>
        <p>hmisId: {this.props.value || 'n/a'}</p>
        <button onClick={this.onChange}>Select</button>
        <button onClick={() => { this.props.onChange(''); }}>Clear</button>
      </div>
    );
  }
}

export default connectField(QuestionPickerField);

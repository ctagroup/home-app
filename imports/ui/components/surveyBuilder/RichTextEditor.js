import PropTypes from 'prop-types';
import React from 'react';
import ReactQuill from 'react-quill';
import { connectField } from 'uniforms';

class RichTextEditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    const modules = {
      toolbar: this.props.toolbar,
    };

    return (
      <div required={this.props.isRequired} className="input-row">
        {this.props.label && (
          <label htmlFor={this.props.id} className="control-label">
            {this.props.label}
          </label>
        )}
        <ReactQuill
          theme="snow"
          modules={modules}
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

RichTextEditorComponent.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  toolbar: PropTypes.array,
};

RichTextEditorComponent.defaultProps = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'blockquote'],
    ['link', 'image', 'video'],
  ],
};

export default connectField(RichTextEditorComponent);

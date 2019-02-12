import React, { Component } from 'react';
import TagItem from './TagItem';

class TagList extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.addTag = this.props.newTagHandler;
  }

  handleChange(key, input) {
    this.setState({ [key]: input });
  }

  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    // const { maskedValue } = this.state;

    return (
      <div className="tag-list">
        <div className="form form-inline">
          <input
            className="form-control"
            type="text"
            placeholder="Enter new tag name.."
            onChange={(value) => this.handleChange('name', value)}
          />
          <button className="btn" onClick={this.addTag}>Add</button>
        </div>
        <div>
          {[1, 2, 3].map(() => (<TagItem />))}
        </div>
      </div>
    );
  }
}

export default TagList;

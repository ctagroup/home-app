import React, { Component } from 'react';
import TagItem from './TagItem';

class TagList extends Component {
  constructor() {
    super();
    this.state = { name: '' };
    this.handleChange = this.handleChange.bind(this);
    this.addTagHandler = this.addTagHandler.bind(this);
  }

  addTagHandler() {
    this.props.newTagHandler(this.state.name);
  }

  handleChange(key, event) {
    const input = event.target.value;
    this.setState({ [key]: input });
  }

  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    // const { maskedValue } = this.state;
    const { tags } = this.props;

    return (
      <div className="tag-list">
        <div className="form form-inline">
          <input
            className="form-control"
            type="text"
            placeholder="Enter new tag name.."
            onChange={(value) => this.handleChange('name', value)}
          />
          <button className="btn" onClick={this.addTagHandler}>Add</button>
        </div>
        <div>
          {tags.map((tag) => (<TagItem key={`tag-${tag.tagId}`} data={tag} />))}
        </div>
      </div>
    );
  }
}

export default TagList;

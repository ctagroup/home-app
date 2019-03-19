import React, { Component } from 'react';
// import DataTable from '/imports/ui/components/dataTable/DataTable';
// import { removeClientTagButton } from '/imports/ui/dataTable/helpers.js';
import TagItem from './TagItem';

class TagList extends Component {
  constructor() {
    super();
    this.state = { name: '', score: 0 };
    this.handleChange = this.handleChange.bind(this);
    this.addTagHandler = this.addTagHandler.bind(this);
  }

  addTagHandler() {
    this.props.newTagHandler(this.state.name, this.state.score);
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
          <input
            className="form-control"
            type="text"
            placeholder="Tag Score.."
            onChange={(value) => this.handleChange('score', value)}
          />
          <button className="btn" onClick={this.addTagHandler}>Add</button>
        </div>
        <div>
          {tags.map((tag) => (<TagItem
            key={`tag-${tag._id}`}
            data={tag}
            removeTagHandler={this.props.removeTagHandler}
          />))}
        </div>
      </div>
    );
  }
}

export default TagList;

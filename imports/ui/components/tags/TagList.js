import React, { Component } from 'react';
import TagItem from './TagItem';

class TagList extends Component {
  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    // const { maskedValue } = this.state;

    return (
      <div className="tag-list">
        <div>
          <input type="text" placeholder="Enter new tag name.." />
          <button>Add</button>
        </div>
        <div>
          {[1, 2, 3].map(() => (<TagItem />))}
        </div>
      </div>
    );
  }
}

export default TagList;

import React, { Component } from 'react';

class TagItem extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.trigger = this.perPage.bind(this);
  // }
  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    const { data: { title } } = this.props;
    const editable = true;
    const removable = true;

    return (
      <span className="btn btn-default btn-sm" style={{ margin: '5px' }}>
        {title}&nbsp;{editable && <a><i className="fa fa-pencil"></i></a>}
        &nbsp;
        {removable && <a><i className="fa fa-times"></i></a>}
      </span>
    );
  }
}

export default TagItem;

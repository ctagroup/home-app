import React, { Component } from 'react';

class TagItem extends Component {
  constructor(props) {
    super(props);
  //   // this.trigger = this.perPage.bind(this);
    this.state = {
      edit: false,
      tempName: this.props.name,
    };
    this.editableField = this.editableField.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  removeTag() {
    return () => this.props.removeTagHandler(this.props.data.id);
  }

  handleChange(key, event) {
    const input = event.target.value;
    this.setState({ [key]: input });
  }

  editableField() {
    return (<div>
      <input
        type="text"
        onChange={(value) => this.handleChange('name', value)}
      />
      <input
        type="text"
        onChange={(value) => this.handleChange('score', value)}
      />
    </div>);
  }
  readOnlyField() {
    const { data: { name, score } } = this.props;

    return (<div>{name}:&nbsp;{score}</div>);
  }

  render() {
    const editable = false;
    const removable = true;
    const { edit } = this.state;

    return (
      <span className="btn btn-default btn-sm" style={{ margin: '5px' }}>
        {edit ? this.editableField() : this.readOnlyField()}
        {editable && <a><i className="fa fa-pencil"></i></a>}
        {removable && <a><i className="fa fa-times" onClick={this.removeTag()}></i></a>}
      </span>
    );
  }
}

export default TagItem;

import React, { Component } from 'react';

class TagItem extends Component {
  constructor(props) {
    super(props);
  //   // this.trigger = this.perPage.bind(this);
    this.state = {
      edit: false,
      name: this.props.data.name,
      score: this.props.data.score,
    };
    this.editableField = this.editableField.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.editTag = this.editTag.bind(this);
    this.editButton = this.editButton.bind(this);
    this.saveTag = this.saveTag.bind(this);
  }

  editTag() {
    this.setState({ edit: !this.state.edit });
  }

  saveTag() {
    const { name, score } = this.state;
    this.props.updateTagHandler(this.props.data.id, name, score);
    this.editTag();
  }

  removeTag() {
    return this.props.removeTagHandler(this.props.data.id);
  }

  handleChange(key, event) {
    const input = event.target.value;
    this.setState({ [key]: input });
  }

  editableField() {
    return (<span className="form form-inline">
      <input
        className="form-control"
        type="text"
        onChange={(value) => this.handleChange('name', value)}
        defaultValue={this.state.name}
        placeholder="Tag name"
      />
      <input
        className="form-control"
        type="number"
        onChange={(value) => this.handleChange('score', value)}
        defaultValue={this.state.score}
        placeholder="Tag score"
      />
      <a style={{ margin: '5px' }}><i className="fa fa-save" onClick={this.saveTag}></i></a>
      {/* this.editButton() */}
    </span>);
  }
  readOnlyField() {
    const { data: { name, score } } = this.props;

    return (<span>{name}:&nbsp;{score}</span>);
  }

  editButton() {
    return (<a style={{ margin: '5px' }}>
      <i className="fa fa-pencil" onClick={this.editTag}></i>
    </a>);
  }

  render() {
    const editable = true;
    const removable = true;
    const { edit } = this.state;


    return (
      <span
        className="btn btn-default btn-sm"
        style={{ margin: '5px' }}
      >
        {edit ? this.editableField() : this.readOnlyField()}
        {editable && this.editButton()}
        {removable && <a style={{ margin: '5px' }}>
          <i className="fa fa-times" onClick={this.removeTag}></i></a>}
      </span>
    );
  }
}

export default TagItem;

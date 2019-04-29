import React, { Component } from 'react';
import { blazeData } from '/imports/ui/dataTable/helpers.js';

class TagItem extends Component {
  constructor(props) {
    super(props);
  //   // this.trigger = this.perPage.bind(this);
    this.state = {
      edit: false,
      name: this.props.data.name,
      score: this.props.data.score,
    };
    this.renderEditableField = this.renderEditableField.bind(this);
    this.renderRemoveButton = this.renderRemoveButton.bind(this);
    this.toggleEditTag = this.toggleEditTag.bind(this);
    this.renderEditButton = this.renderEditButton.bind(this);
    this.saveTag = this.saveTag.bind(this);
  }

  toggleEditTag() {
    this.setState({ edit: !this.state.edit });
  }

  saveTag() {
    const { name, score } = this.state;
    this.props.updateTagHandler(this.props.data.id, name, score);
    this.toggleEditTag();
  }

  // removeTag() {
  //   return this.props.removeTagHandler(this.props.data.id);
  // }

  handleChange(key, event) {
    const input = event.target.value;
    this.setState({ [key]: input });
  }

  renderRemoveButton() {
    const _id = this.props.data.id;
    const rowData = this.props.data;
    const onSuccessCallback = this.props.removeTagHandler;
    const templateData = {
      _id,
      operation: 1,
      operationText: 'Remove',
      title: 'Confirm removal',
      message: `Are you sure you want to remove tag #${rowData.id} (${rowData.name})?`,
      method: 'tagApi',
      args: ['deleteTag', rowData.id],
      onSuccess() {
        if (onSuccessCallback) onSuccessCallback(rowData.id);
      },
    };
    return blazeData('DataTableTextButton', templateData);
  }

  renderEditableField() {
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
    </span>);
  }

  renderReadOnlyField() {
    const { data: { name, score } } = this.props;

    return (<span>{name}:&nbsp;{score}</span>);
  }

  renderEditButton() {
    return (<a style={{ margin: '5px' }}>
      <i className="fa fa-pencil" onClick={this.toggleEditTag}></i>
    </a>);
  }

  render() {
    const editable = true;
    // const removable = true;
    const { edit } = this.state;

    return (
      <span
        className="btn btn-default btn-sm"
        style={{ margin: '5px' }}
      >
        {edit ? this.renderEditableField() : this.renderReadOnlyField()}
        {editable && this.renderEditButton()}
        {this.renderRemoveButton()}
        {/** removable && <a style={{ margin: '5px' }}>
          <i className="fa fa-times" onClick={this.removeTag}></i></a> */}
      </span>
    );
  }
}

export default TagItem;

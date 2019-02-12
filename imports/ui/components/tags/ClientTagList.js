import React, { Component } from 'react';
import Select from 'react-select';
// import ClientTagItem from './ClientTagItem';
import DataTable from '/imports/ui/components/dataTable/DataTable';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class ClientTagList extends Component {
  constructor() {
    super();
    this.state = { date: moment.now() };
    this.handleChange = this.handleChange.bind(this);
    this.renderDatePicker = this.renderDatePicker.bind(this);
    this.toggleNewTag = this.toggleNewTag.bind(this);
    this.renderNewClientTag = this.renderNewClientTag.bind(this);
  }

  toggleNewTag() {
    this.setState({ newTag: !this.state.newTag });
  }

  handleChange(key, input) {
    this.setState({ [key]: input });
  }

  renderDatePicker(key) {
    const dateValue = this.state && this.state[key];
    return (<DatePicker
      className="form-control"
      selected={dateValue ? moment(dateValue) : ''}
      onChange={(value) => this.handleChange(key, value)}
      placeholderText="MM/DD/YYYY"
    />);
  }

  renderNewClientTag() {
    const { newTag, newTagId, newTagAction } = this.state || {};
    const tagList = [
      { _id: 1, title: 'First' },
      { _id: 1, title: 'Second' },
    ].map(({ _id, title }) => ({ value: _id, label: title }));

    const actionsList = [{ value: 0, label: 'Removed' }, { value: 1, label: 'Added' }];

    return (<div style={{ padding: '10px' }} className="form form-inline">
      {!newTag && <a onClick={this.toggleNewTag}>Add new tag</a>}
      {newTag && <div>
        <label>Add new tag:
          {/* <input
            type="text" className="form-control input-sm"
            placeholder=""
          /> */}
        </label>
        <div className="form-group" style={{ minWidth: '12em', padding: '0 .25em' }}>
          <Select
            value={newTagId}
            onChange={(option) => this.handleChange('newTagId', option)}
            options={tagList}
            placeholder="Select tag:"
          />
        </div>
        <div className="form-group" style={{ minWidth: '12em', padding: '0 .25em' }}>
          <Select
            value={newTagAction}
            onChange={(option) => this.handleChange('newTagAction', option)}
            options={actionsList}
            placeholder="Select action:"
          />
        </div>
        <div className="form-group" style={{ minWidth: '12em', padding: '0 .25em' }}>
          {this.renderDatePicker('newTagDate')}
        </div>
        <a
          className="btn btn-default"
          onClick={this.createNewTag} style={{ margin: '0 .25em' }}
        >
          Create
        </a>
        <a
          className="btn btn-danger"
          onClick={this.toggleNewTag}
          style={{ margin: '0 .25em' }}
        >
          Cancel
        </a>
      </div>
      }
    </div>);
  }

  render() {
    // TODO: needed columns: title, status, appliedOn, appliedBy, remove

    // const { name: inputName, className, style, disabled } = this.props;
    // const { tags } = this.props;


    const tableOptions = {
      columns: [
        {
          title: 'Tag Name',
          data: 'title',
          // render(value) {
          //   return moment(value).format('MM/DD/YYYY');
          // },
        },
        {
          title: 'Status',
          data: 'status',
          render(value) {
            return value == 0 ? 'Removed' : 'Added'; // eslint-disable-line eqeqeq
          },
        },
        {
          title: 'Client Name',
          data: '_id',
          // render(value) {
          //   const client = PendingClients.findOne({ _id: value });
          //   const name = (`${client.firstName.trim()} ${client.lastName.trim()}`).trim();
          //   return `<a href="/clients/${value}">${name}</a>`;
          // },
        },
        {
          title: 'Applied On',
          data: 'appliedOn',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
      ],
    };

    const tags = [{ title: 'First' }, { title: 'Second' }];
    const tableData = tags;
    const options = tableOptions;

    const disabled = true;
    // const { maskedValue } = this.state;


            // value={filter}
            // onChange={this.handleChange}
    // TODO: move padding to style
    return (
      <div className="tag-list-wrapper">
        <div className="tag-filter" style={{ padding: '10px' }}>
          {this.renderDatePicker('date')}
        </div>
        {this.renderNewClientTag()}
        <div className="tag-list">
          {/* {tags.map((tag, index) =>
            (<ClientTagItem tag={tag} key={`client-tag-${index}`} />))} */}
          <DataTable
            disableSearch={disabled}
            options={options}
            data={tableData}
          />
        </div>
      </div>
    );
  }
}

export default ClientTagList;

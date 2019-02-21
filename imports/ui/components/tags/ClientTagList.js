import React, { Component } from 'react';
import Select from 'react-select';
// import ClientTagItem from './ClientTagItem';
import DataTable from '/imports/ui/components/dataTable/DataTable';
import { removeClientTagButton } from '/imports/ui/dataTable/helpers.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class ClientTagList extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.renderDatePicker = this.renderDatePicker.bind(this);
    this.toggleNewTag = this.toggleNewTag.bind(this);
    this.renderNewClientTag = this.renderNewClientTag.bind(this);
    this.createNewTag = this.createNewTag.bind(this);
    this.getDate = this.getDate.bind(this);
  }

  getDate() {
    return (this.state.date || { toDate() { return Date.now(); } }).toDate();
  }

  createNewTag() {
    const newTagData = {
      tagId: this.state.newTagId.value,
      appliedOn: (this.state.newTagDate || { toDate() { return Date.now(); } }).toDate(),
      action: this.state.newTagAction.value,
    };
    this.props.newClientTagHandler(newTagData);
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
      selected={dateValue ? moment(dateValue) : moment(Date.now())}
      onChange={(value) => this.handleChange(key, value)}
      placeholderText="MM/DD/YYYY"
    />);
  }

  renderNewClientTag() {
    const { newTag, newTagId, newTagAction } = this.state || {};
    const { tags } = this.props;
    const tagList = tags.map(({ tagId, title }) => ({ value: tagId, label: title }));

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
    // TODO: needed columns: title, action, appliedOn, appliedBy, remove

    // const { name: inputName, className, style, disabled } = this.props;
    const { tags, clientTags } = this.props;
    // TODO: use collection instead?
    const tagMap = tags.reduce((acc, tag) => ({ ...acc, [tag.tagId]: tag }), {});

    const activeDate = this.getDate;
    const activeDateInMs = activeDate().valueOf();
    // const activeTags = clientTags.filter(({ appliedOn }) => appliedOn < activeDateInMs);
    const activeTags = clientTags.filter(({ appliedOn }) => {
      console.log('appliedOn < activeDateInMs', appliedOn < activeDateInMs);
      return appliedOn < activeDateInMs;
    });

    const tableOptions = {
      columns: [
        {
          title: 'Tag Name',
          data: 'title',
          render(value, op, doc) {
            return (tagMap[doc.tagId] || {}).title;
            // return moment(value).format('MM/DD/YYYY');
          },
        },
        {
          title: 'Action',
          data: 'action',
          render(value) {
            return value == 0 ? 'Removed' : 'Added'; // eslint-disable-line eqeqeq
          },
        },
        {
          title: 'Applied On',
          data: 'appliedOn',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
        // {
        //   title: 'Applied By',
        //   data: 'appliedBy',
        //   render(value) {
        //     const user Clients.find().fetch();
        //     return moment(value).format('MM/DD/YYYY');
        //   },
        // },
        removeClientTagButton((clientTag) => {
          console.log('removeClientTagButton', clientTag, activeDateInMs);
          // Projects._collection.remove(project._id); // eslint-disable-line
        }, activeDate),
      ],
    };

    const tableData = activeTags;
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
            data={clientTags}
            resolveData={data => data.filter(({ appliedOn }) => appliedOn < activeDateInMs)}
          />
        </div>
      </div>
    );
  }
}

export default ClientTagList;

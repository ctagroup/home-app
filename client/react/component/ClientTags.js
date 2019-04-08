import moment from 'moment';
import React from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
// import { Clients } from '../../../imports/api/clients/clients';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
// import ClientTagItem from './ClientTagItem';
import DataTable2 from '../../../imports/ui/components/dataTable/DataTable2'; // FIXME
import { removeClientTagButton } from '../../../imports/ui/dataTable/helpers.js';
import { getActiveTagNamesForDate, dateOnly } from '../../../imports/api/tags/tags';
import ClientTagList from '../../../imports/ui/components/tags/ClientTagList.js';
// import { Tags } from '../../../imports/api/tags/tags.js';
import { ClientTags } from '../../../imports/api/tags/clientTags.js';


export default class ClientsTags extends React.Component {

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
    return dateOnly(this.state.date);
  }

  createNewTag() {
    // console.log(this.state);
    // console.log('-- testing --');
    const appliedOn = moment(this.state.newTagDate || new Date()).format('YYYY-MM-DDT00:00');
    const newTagData = {
      clientId: this.props.clientId,
      tagId: this.state.newTagId.value,
      appliedOn,
      operation: this.state.newTagAction.value,
      note: this.state.note,
    };
    this.newClientTagHandler(newTagData);
  }

  toggleNewTag() {
    this.setState({ newTag: !this.state.newTag });
  }

  handleChange(key, input) {
    this.setState({ [key]: input });
  }

  handleInputChange(key, event) {
    const input = event.target.value;
    this.setState({ [key]: input });
  }

  component() {
    return ClientTagList;
  }

  tags() {
    return Tags.find().fetch();
  }

  clientTags() {
    return ClientTags.find().fetch();
  }
  newClientTagHandler(data) {
    console.log(data);
    return Meteor.call('tagApi', 'createClientTag', { operation: 1, ...data }, (err, res) => {
        if (!err) ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
    });
  }

  removeClientTagHandler() {
    return ({ _id }) => ClientTags._collection.remove({ _id }); // eslint-disable-line
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
    // console.log('-- This --');
    // console.log(this.tags());
    // console.log('-- This --');
    const { newTag, newTagId, newTagAction } = this.state || {};
    const { tags } = this.props;
    const tagList = [{}]; // tags.map(({ id, name }) => ({ value: id, label: name }));

    const actionsList = [{ value: 0, label: 'Disabled' }, { value: 1, label: 'Applied' }];

    return (<div style={{ padding: '10px' }} className="form form-inline">
      {!newTag && <a onClick={this.toggleNewTag}>Add new tag</a>}
      {newTag && <div>
        <label>Add new tag:
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
        <div className="form-group" style={{ minWidth: '12em', padding: '0 .25em' }}>
          <input
            type="text"
            placeholder="note"
            className="form-control input-sm"
            onChange={(value) => this.handleInputChange('note', value)}
          />
        </div>
        <a
          className="btn btn-primary"
          onClick={this.createNewTag} style={{ margin: '0 .25em' }}
        >
          Create
        </a>
        <a
          className="btn btn-default"
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
    // TODO: needed columns: tagId, action, appliedOn, appliedBy, remove

    const clientTags = [{}]; // this.props;
    const selectedDate = '';// this.getDate();
    const activeTagNames = [{}]; // getActiveTagNamesForDate(clientTags, selectedDate);

    const tableOptions = {
      columns: [
        {
          title: 'Tag Name',
          data: 'name',
          render(value, op, doc) {
            return ''; // doc.tag.name;
          },
        },
        {
          title: 'Operation',
          data: 'operation',
          render(value) {
            return value == 0 ? 'Removed' : 'Added'; // eslint-disable-line eqeqeq
          },
        },
        {
          title: 'Applied On',
          data: 'appliedOn',
          render(value) {
            return ''; // moment(value).format('MM/DD/YYYY');
          },
        },
        // removeClientTagButton((clientTag) => {
        //   if (this.props.removeClientTagHandler) {
        //     this.props.removeClientTagHandler(clientTag);
        //   }
        // }),
      ],
    };

    const options = tableOptions;

    const disabled = true;
    // const { maskedValue } = this.state;
    // resolveData={data => data.filter(({ appliedOn }) => appliedOn < activeDateInMs)}

    // TODO: move padding to style

    const listOfActiveTags = 'none'; // activeTagNames.length > 0 ?  activeTagNames.join(', ') : 'none';

    return (
      <div className="tab-pane fade show" id="panel-client-tags" role="tabpanel">
        <div className="row">
          <div className="col-xs-12">
            <h3>Tags</h3>
            <div className="client-tags-list-wrapper">
              <div className="tag-list-wrapper">
                <div className="tag-filter" style={{ padding: '10px' }}>
                  Active tags by date:
                  {this.renderDatePicker('date')}
                  <strong>{listOfActiveTags}</strong>
                </div>
                <br />
                <h4>Tags History</h4>
                {this.renderNewClientTag()}
                <div className="tag-list">
                  <DataTable2
                    disableSearch={disabled}
                    options={options}
                    data={clientTags}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

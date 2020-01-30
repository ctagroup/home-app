import moment from 'moment';
import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
// import ClientTagItem from './ClientTagItem';
import DataTable from '/imports/ui/components/dataTable/DataTable';
import { blazeData, removeClientTagButton } from '/imports/ui/dataTable/helpers.js';
import { getActiveTagsForDate, getActiveTagNamesForDate, dateOnly } from '/imports/api/tags/tags';
import { formatDateTime } from '/imports/both/helpers';
import { getBonusScore } from '/imports/api/tags/helpers';


class ClientTagList extends Component {
  constructor() {
    super();
    this.state = {
      newTagId: {},
      newTagAction: {},
      date: new Date,
    };
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
    const { tags, newClientTagHandler } = this.props;
    const tagHash = tags.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {});
    const appliedOn = moment(this.state.newTagDate || new Date()).format('YYYY-MM-DDT00:00');
    const newTagData = {
      clientId: this.props.clientId,
      tagId: this.state.newTagId.value,
      tag: tagHash[this.state.newTagId.value] || {},
      appliedOn,
      operation: this.state.newTagAction.value,
      note: this.state.note,
    };

    // this.props.newClientTagHandler(newTagData);
    const rowData = newTagData;
    const data = {
      simple: true,
      operation: rowData.operation,
      operationText: 'Add',
      title: 'Confirm adding',
      message: `Are you sure you want to add client tag ${rowData.tag.name}?`,
      method: 'tagApi',
      args: ['createClientTag', rowData],
      onSuccess(result) {
        newClientTagHandler(result);
        console.warn('TODO: refresh client score!');
      },
    };
    return data;
    // this.props.setAppContext('appDeleteModal', data);
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

  renderDatePicker(key) {
    const dateValue =
      this.state && this.state[key] && moment(this.state[key]).toDate() || new Date;
    return (<DatePicker
      className="form-control"
      selected={dateValue}
      onChange={(value) => this.handleChange(key, value)}
      placeholderText="MM/DD/YYYY"
    />);
  }

  renderNewClientTag() {
    const { newTag, newTagId, newTagAction } = this.state || {};
    const { tags } = this.props;
    const tagList = tags.map(({ id, name }) => ({ value: id, label: name }));

    const actionsList = [{ value: 0, label: 'Disabled' }, { value: 1, label: 'Applied' }];

    const templateData = this.createNewTag();

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
        <div className="form-group" style={{ minWidth: '12em', padding: '0 .25em' }}>
          <textarea
            rows="3"
            placeholder="note"
            className="form-control input-sm"
            onChange={(value) => this.handleInputChange('note', value)}
          />
        </div>
        {/* <a
          className="btn btn-primary"
          onClick={this.createNewTag} style={{ margin: '0 .25em' }}
        >
          Create
        </a> */}
        {blazeData('CreateButton', templateData, 'form-group')}
        <a
          className="btn btn-default"
          data-toggle="modal" doc="{{_id}}"
          href="#app-delete-modal"
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
    const { clientTags } = this.props;
    const selectedDate = this.getDate();
    const activeTagNames = getActiveTagNamesForDate(clientTags, selectedDate);

    const clientActiveTags = getActiveTagsForDate(clientTags, selectedDate);

    const latestClientTags = clientActiveTags.reduce((all, cTag) => ({
      ...all,
      [cTag.tag.id]: {
        operation: cTag.operation,
        cTag,
      },
    }), {})
    ;


    // FIXME: remove data extension workaround
    const extendedTags = Object.values(latestClientTags)
      .map((tag) => ({ ...tag.cTag, date: this.state.date }));

    const tableOptions = {
      columns: [
        {
          title: 'Tag Name',
          data: 'name',
          render(value, op, doc) {
            return `<a href="#">${doc.tag.name}</a>`; // tag history link
          },
        },
        // {
        //   title: 'Notes',
        //   data: 'note',
        // },
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
            return formatDateTime(value);
          },
        },
        removeClientTagButton((clientTag) => {
          if (this.props.removeClientTagHandler) {
            this.props.removeClientTagHandler(clientTag);
            console.warn('TODO: refresh client score!');
          }
        }),
      ],
    };

    const options = tableOptions;

    const disabled = true;
    // const { maskedValue } = this.state;
    // resolveData={data => data.filter(({ appliedOn }) => appliedOn < activeDateInMs)}

    // TODO: move padding to style

    const listOfActiveTags = activeTagNames.length > 0 ?
      activeTagNames.join(', ') : 'none';

    const ec = this.props.eligibleClient || {
      surveyScore: '',
      bonusScore: '',
      totalScore: '',
    };
    const bonusScoreFromCurrentTags = getBonusScore();

    return (
      <div className="tag-list-wrapper">
        <div className="tag-filter" style={{ padding: '10px' }}>
          <strong>Active tags by date:</strong>
          {this.renderDatePicker('date')}
          <strong>{listOfActiveTags}</strong>
        </div>
        <br />
        <h4>Current Score (HSLYNK)</h4>
        <ul>
          <li>Survey: {ec.surveyScore}</li>
          <li>Bonus: {ec.bonusScore}</li>
          <li>Total: {ec.totalScore}</li>
        </ul>
        {
          ec.bonusScore !== bonusScoreFromCurrentTags &&
            <div className="alert alert-danger">
              <strong>Bonus score out of sync!</strong>
              <p>
                HSLYNK bonus score ({ec.bonusScore}) differs fom Bonus score for active
                tags ({bonusScoreFromCurrentTags})!
              </p>
            </div>
        }

        <h4>Tags History</h4>
        {this.renderNewClientTag()}
        <div className="tag-list">
          {/* {tags.map((tag, index) =>
            (<ClientTagItem tag={tag} key={`client-tag-${index}`} />))} */}
          <DataTable
            disableSearch={disabled}
            options={options}
            data={extendedTags}
          />
        </div>
      </div>
    );
  }
}

export default ClientTagList;

import React, { Component } from 'react';
import ClientTagItem from './ClientTagItem';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class ClientTagList extends Component {
  constructor() {
    super();
    this.state = { date: moment.now() };
    this.handleChange = this.handleChange.bind(this);
    this.renderDatePicker = this.renderDatePicker.bind(this);
  }


  handleChange(input) {
    this.setState({ date: input });
  }

  renderDatePicker() {
    // const dateValue = '01/20/1990';
    const dateValue = this.state && this.state.date;
    return (<DatePicker
      selected={dateValue ? moment(dateValue) : ''}
      onChange={(value) => this.handleChange(value)}
      placeholderText="MM/DD/YYYY"
    />);
  }

  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    // const { tags } = this.props;
    const tags = [{ title: 'First' }, { title: 'Second' }];
    // const { maskedValue } = this.state;

    return (
      <div className="tag-list-wrapper">
        <div className="tag-filter">
          {this.renderDatePicker()}
        </div>
        <div className="tag-list">
          {tags.map((tag, index) => (<ClientTagItem tag={tag} key={`client-tag-${index}`} />))}
        </div>
      </div>
    );
  }
}

export default ClientTagList;

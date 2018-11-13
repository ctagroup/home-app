import './eventsListView.html';
import React from 'react';
import moment from 'moment';
import EventLog from '/imports/api/eventLog/eventLog';


class EventsList extends React.Component {
  renderRows() {
    const events = this.props.events || [];
    return events.map(event =>
      <tr key={event._id}>
        <td>{moment(event.createdAt).format('MM/DD/YYYY h:mm A')}</td>
        <td>{event.type}</td>
        <td>{event.message}</td>
        <td>{event.createdBy}</td>
      </tr>
    );
  }
  render() {
    return (
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Message</th>
            <th>By</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

Template.eventsListView.helpers({
  component() {
    return EventsList;
  },
  events() {
    return EventLog.queryRecentEvents();
  },
});

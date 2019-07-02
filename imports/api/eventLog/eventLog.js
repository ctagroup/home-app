import { Mongo } from 'meteor/mongo';


class EventLogClass extends Mongo.Collection {
  addEvent(event) {
    const doc = {
      type: event.getType(),
      message: event.getMessage(),
      createdAt: event.createdAt,
      createdBy: event.userId,
      data: event.data,
    };
    super.insert(doc);
  }

  addRawEvent(doc) {
    super.insert(doc);
  }

  queryRecentEvents() {
    return super.find({}, { sort: { createdAt: -1 } });
  }
}

const EventLog = new EventLogClass('eventLog');

const EventSchema = new SimpleSchema({
  type: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  data: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

EventLog.schema = EventSchema;
EventLog.attachSchema(EventLog.schema);

export default EventLog;

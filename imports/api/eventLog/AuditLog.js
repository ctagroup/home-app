import EventLog from '/imports/api/eventLog/eventLog';


export default class AuditLog {
  constructor({ userId, eventId, endpointName }) {
    this.userId = userId;
    this.eventId = eventId;
    this.endpointName = endpointName;
    this.eventLog = EventLog;
  }

  addMessage(message, data = {}) {
    const doc = {
      type: this.endpointName,
      message,
      createdAt: new Date(),
      createdBy: this.userId,
      data: {
        ...data,
        eventId: this.eventId,
      },
    };
    this.eventLog.addRawEvent(doc);
  }
}

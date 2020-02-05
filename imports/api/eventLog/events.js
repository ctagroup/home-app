import { EventEmitter2 } from 'eventemitter2';
import EventLog from './eventLog';


export class SystemEvent {
  constructor(context = {}) {
    this.userId = context.userId || 'server';
    this.createdAt = new Date();
  }

  getType() {
    return this.constructor.name;
  }

  getMessage() {
    return `${this.getType()} fired`;
  }
}

export class UserEvent extends SystemEvent {
  constructor(type, message, context) {
    const { userId, ...data } = context;
    super({ userId });
    this.type = type;
    this.message = message;
    this.data = data;
  }

  getType() {
    return this.type;
  }

  getMessage() {
    return this.message;
  }
}

export class SurveyUpdatedEvent extends SystemEvent {
  constructor(surveyId, context) {
    super(context);
    this.surveyId = surveyId;
  }
}

export class DataEvent extends SystemEvent {
  constructor(data, context) {
    super(context);
    this.data = data;
  }
}

export class ServerStartedEvent extends SystemEvent {
  getMessage() {
    return 'Server started';
  }
}

export class ClientCreatedEvent extends DataEvent {
  getMessage() {
    const { clientId, schema } = this.data;
    return `client ${clientId} (${schema}) created`;
  }
}

export class ClientUpdatedEvent extends DataEvent {
  getMessage() {
    const { clientId, schema } = this.data;
    return `client ${clientId} (${schema}) updated`;
  }
}

class EventPublisher extends EventEmitter2 {
  publish(event) {
    console.log('publishing', event.getType());
    this.emit(event.getType(), event);
  }

  addListener(eventClass, callback, ...args) {
    super.on(eventClass.name, callback, ...args);
  }

  removeListener(eventClass, callback, ...args) {
    super.off(eventClass.name, callback, ...args);
  }
}

const eventPublisher = new EventPublisher({
  wildcard: true,
  delimiter: '.',
});

// catch any event
eventPublisher.on('**', (event) => {
  EventLog.addEvent(event);
});

export default eventPublisher;

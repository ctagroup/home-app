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
    this.emit(event.getType(), event);
  }

  addListener(eventClass, callback, ...args) {
    super.on(eventClass.name, callback, ...args);
  }
}

const eventPublisher = new EventPublisher({
  wildcard: true,
  delimiter: '.',
});

eventPublisher.addListener(ServerStartedEvent, (event) => {
  EventLog.addEvent(event);
});
eventPublisher.addListener(ClientCreatedEvent, (event) => {
  EventLog.addEvent(event);
});
eventPublisher.addListener(ClientUpdatedEvent, (event) => {
  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX cud');
  EventLog.addEvent(event);
});

export default eventPublisher;

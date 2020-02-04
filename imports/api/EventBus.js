import { EventEmitter2 } from 'eventemitter2';

const eventBus = new EventEmitter2({
  wildcard: true,
  delimiter: '::',
});

if (global.window) {
  global.window.eventBus = eventBus;
}

export default eventBus;

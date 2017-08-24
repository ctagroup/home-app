const contextDeps = [];
const data = {};

export function getAppContext(key) {
  if (contextDeps[key] === undefined) {
    contextDeps[key] = new Tracker.Dependency();
  }
  contextDeps[key].depend();
  return data[key];
}

export function setAppContext(key, value) {
  data[key] = value;
  if (contextDeps[key]) {
    contextDeps[key].changed();
  }
}

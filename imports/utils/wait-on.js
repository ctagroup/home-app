export const WaitOn = {};

// We need to store the dep, ready flag, and data for each call
WaitOn.d_waitOns = {};

// This function returns a handle with a reactive ready function, which
// is what waitOn expects. waitOn will complete when the reactive function
// returns true.

WaitOn.method = function waitOnMethod(name, ...args) {
  // This prevents the method call from being called multiple times
  // and the resulting infinite loop.

  if (this.d_waitOns[name] !== undefined && this.d_waitOns[name].ready === true) {
    return false;
  }

  this.d_waitOns[name] = {};
  const self = this;

  // We need to store the dependency and the ready flag.
  this.d_waitOns[name].dep = new Deps.Dependency();
  this.d_waitOns[name].ready = false;

  const hasCallback = typeof args[args.length - 1] === 'function';
  const callback = hasCallback ? args.pop() : undefined;

  const waitOnCallback = function waitOnCallback(err, or) {
    // The call has complete, so set the ready flag, notify the reactive
    // function that we are ready, and store the data.
    self.d_waitOns[name].ready = true;
    self.d_waitOns[name].dep.changed();
    self.d_waitOns[name].data = (err || or);
    if (callback) {
      callback(err, or);
    }
  };

  console.log('calling meteor.method');

  Meteor.call.apply(this, [name, ...args, waitOnCallback]);

  // The reactive handle that we are returning.
  const handle = {
    ready: () => {
      self.d_waitOns[name].dep.depend();
      return self.d_waitOns[name].ready;
    },
  };
  return handle;
};

// Retrieve the data that we stored in the async callback.
WaitOn.getResponse = function getResponse(name) {
  const data = this.d_waitOns[name].data;
  // Clear out the data so a second call with the same name wont return
  // the same data.
  this.d_waitOns[name] = {};
  return data;
};

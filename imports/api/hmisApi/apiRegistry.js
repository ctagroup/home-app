export class ApiRegistry {
  constructor() {
    this.apis = {};
  }

  addApi(name, cls) {
    this.apis[name] = cls;
  }

  getApi(name) {
    if (!this.apis.hasOwnProperty(name)) {
      throw new Error(`Api "${name}" is not registered`);
    }
    return this.apis[name];
  }
}

// Default registry for all the APIs
export const HmisApiRegistry = new ApiRegistry();

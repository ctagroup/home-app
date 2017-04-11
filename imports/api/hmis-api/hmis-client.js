export class ApiRegistry {
  constructor() {
    this.apis = {};
  }

  addApi(name, cls) {
    this.apis[name] = cls;
  }

  getApi(name) {
    if (!this.apis.hasOwnProperty(name)) {
      throw new Meteor.Error('ApiRegistry', `Api ${name} is not registered`);
    }
    return this.apis[name];
  }
}

// Default registry for all the APIs
export const HmisApiRegistry = new ApiRegistry();


export class HmisClient {
  constructor(userId, appId, appSecret, registry) {
    this.userId = userId;
    this.registry = registry;
  }

  api(name) {
    const Cls = this.registry.getApi(name);
    return new Cls();
  }

  static create(userId) {
    const { appId, appSecret } = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!appId || !appSecret) {
      throw new ServiceConfiguration.ConfigError();
    }
    return new HmisClient(userId, appId, appSecret, HmisApiRegistry);
  }
}


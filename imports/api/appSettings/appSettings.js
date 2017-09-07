import { Mongo } from 'meteor/mongo';


class AppSettingsClass extends Mongo.Collection {
  set(key, value) {
    return this.upsert(key, { value });
  }
  get(key, defaultValue) {
    return (this.findOne(key) || {}).value || defaultValue;
  }
  remove(key) {
    return super.remove(key);
  }
}

const AppSettings = new AppSettingsClass('options');

export default AppSettings;

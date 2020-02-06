class Lookup {
  constructor(data = {}) {
    this.data = data;
  }

  get(key, defaultValueFn) {
    if (!this.data.key) {
      this.data.key = defaultValueFn();
    }
    return this.data.key;
  }

  set(key, value) {
    this.data.key = value;
  }
}

export default Lookup;

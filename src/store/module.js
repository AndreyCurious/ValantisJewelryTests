
class StoreModule {

  constructor(store, name, config = {}) {
    this.store = store;
    this.name = name;
    this.config = config;
  }

  initState() {
    return {}
  }

  getState() {
    return this.store.getState()[this.name];
  }

  setState(newState, description = 'setState') {
    this.store.setState({
      ...this.store.getState(),
      [this.name]: newState
    }, description)
  }

}

export default StoreModule;

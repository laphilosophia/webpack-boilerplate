export default class Store {
  actions!: {};
  mutations!: {};
  state!: {};
  status!: string;
  callbacks!: any[];

  constructor(params: { hasOwnProperty: (arg0: string) => any; actions: {}; mutations: {}; initialState: any; }) {
    const self = this;

    self.actions = {};
    self.mutations = {};
    self.state = {};

    self.status = 'resting';

    self.callbacks = [];

    if (params.hasOwnProperty('actions')) {
      self.actions = params.actions;
    }

    if (params.hasOwnProperty('mutations')) {
      self.mutations = params.mutations;
    }

    self.state = new Proxy((params.initialState || {}), {
      set(state, key, value) {
        state[key] = value;
        self.processCallbacks(self.state);
        self.status = 'resting';

        return true;
      }
    });
  }

  dispatch(actionKey: string | number, payload: any) {
    const self = this;

    if (typeof self.actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey}" doesn't exist.`);
      return false;
    }

    self.status = 'action';

    return self.actions[actionKey](self, payload);
  }

  commit(mutationKey: string | number, payload: any) {
    const self = this;

    if (typeof self.mutations[mutationKey] !== 'function') {
      console.error(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }

    self.status = 'mutation';

    let newState = self.mutations[mutationKey](self.state, payload);

    self.state = newState;

    return true;
  }

  processCallbacks(data: {}) {
    const self = this;

    if (!self.callbacks.length) {
      return false;
    }

    self.callbacks.forEach(callback => callback(data));

    return true;
  }

  subscribe(callback: any) {
    const self = this;

    if (typeof callback !== 'function') {
      console.error('You can only subscribe to Store changes with a valid function');
      return false;
    }

    self.callbacks.push(callback);

    return true;
  }
}

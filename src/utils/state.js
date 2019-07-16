// Gives non-vue javascript access to state values
// NOTE: the official state of application is vuex (store.js). This is meant to be a proxy
let store = null; // memory pointer

function init(vuexStore) {
  store = vuexStore;
}

function get(key) {
  return store.state[key];
}

function set(key, value) {
  // set the value in vuex store
  store.dispatch('_syncState', { key, value });
  return get(key);
}

export default { init, get, set };

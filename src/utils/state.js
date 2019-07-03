// these are the expected state values. Not absolutely necessary to predefine here, but it's instructive to.
const state = {
  identifier: null,
  socketStatus: null, // -2:error, -1:unconnected, 0:connecting, 1:connected
  isHost: null, // null: hasn't picked, 0: no, 1: yes
};
// functions to trigger when state changes. fn(value, oldValue, key, state)
const stateTriggers = {};

function init() {
  // doesn't do anything. Caller signifies the entry point for this script
}

function get(key) {
  return (typeof state[key] === 'function') ? state[key](state) : state[key];
  return state[key];
}

function set(key, value) {
  // look for triggers
  if (stateTriggers[key] && stateTriggers[key].length) {
    const oldValue = JSON.parse(JSON.stringify(state[key])); // JSON trick to copy and never reference
    stateTriggers[key].forEach((fn) => {
      fn(value, oldValue, key, state);
    });
  }
  state[key] = value;
  return get(key);
}

function onChange(key, fn) {
  if (!fn || typeof fn !== 'function') return;
  // initialize array for the key
  if (stateTriggers[key] === undefined) stateTriggers[key] = [];
  stateTriggers[key].push(fn);
}

export default { init, get, set, onChange };

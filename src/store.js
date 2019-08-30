import state from './utils/state';

const initialState = {
  identifier: null,
  socketStatus: null, // -2:error, -1:unconnected, 0:connecting, 1:connected
  isHost: null, // null: hasn't picked, 0: no, 1: yes
  currentRole: null, // null: hasn't picked, 0: engi, 1: captain, 2: pilot, 3: intel
  // pilot controls
  thrustValue: 0, // the position of the thruster control,
  console: [0],
};

export default {
  state: initialState,
  mutations: { // all state changes must also update state.js to keep it in sync
    setCurrentRole(state, payload) {
      state.currentRole = payload.role;
    },
    setThrustValue(state, payload) {
      state.thrustValue = payload.thrustValue;
    },
    _syncState(state, payload) { // called by state.js, which allows non vue javascript to update vuex state
      if (payload.value === null) {
        state[payload.key] = null;
      } else if (Array.isArray(payload.value)) {
        state[payload.key] = [...payload.value]; // copy the array to avoid reference
      } else if (typeof payload.value === 'object') {
        state[payload.key] = Object.assign({}, payload.value); // copy the object to avoid reference
      } else {
        // primitives and functions
        state[payload.key] = payload.value;
      }
    }
  },
  actions: {
    setCurrentRole({ commit }, role) {
      commit('setCurrentRole', { role });
    },
    _syncState({ commit }, payload) { // called by state.js, which allows non vue javascript to update vuex state
      commit('_syncState', payload)
    }
  },
  getters: { // computed properties
  }
};

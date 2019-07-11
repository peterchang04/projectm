export default {
  state: {
    identifier: null,
    socketStatus: null, // -2:error, -1:unconnected, 0:connecting, 1:connected
    isHost: null, // null: hasn't picked, 0: no, 1: yes
    currentRole: null, // null: hasn't picked, 0: engi, 1: captain, 2: pilot, 3: intel
  },
  mutations: {
    setCurrentRole(state, payload) {
      state.currentRole = payload.role;
    },
  },
  actions: {
    setCurrentRole({ commit }, role) {
      commit('setCurrentRole', { role });
    }
  },
  getters: { // computed properties
  }
};

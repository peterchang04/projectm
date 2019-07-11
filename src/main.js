/* nothing to do here. This is an entry point file only */
import Vue from 'vue';
import Vuex from 'vuex';
import s from './store';
import Layout from './components/Layout.vue';
import router from './router';
import state from './utils/state';
import socket from './utils/socketio';
import peers from './utils/peers';

Vue.config.productionTip = false; // suppresses annoying "you are running vue in development mode" message

// setup state management by vuex
Vue.use(Vuex);
const store = new Vuex.Store(s); // definition found at store.js

state.init(store); // state.js allows for non Vue javascript to access and manipulate vuex state.

// multiplayer connections
socket.init(); // socket.io which allows for webRTC
peers.init(); // webRTC

new Vue({
  router,
  store, // vuex
  render: h => h(Layout),
  data: {
    currentRoute: window.location.pathname,
  }
}).$mount('#app');

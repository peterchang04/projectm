import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import Layout from './components/Layout.vue';
import router from './router';
import state from './utils/state';
import socket from './utils/socketio';
import peers from './utils/peers';

Vue.config.productionTip = false;
Vue.use(Vuex);
/* nothing to do here. This is an entry point file only */

state.init();
socket.init();
peers.init();

new Vue({
  router,
  store: new Vuex.Store(store),
  render: h => h(Layout),
  data: {
    currentRoute: window.location.pathname,
  }
}).$mount('#app');

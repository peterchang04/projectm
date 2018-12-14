import Vue from 'vue';
import Layout from './Layout.vue';
import router from './router';
import state from './state';
import socket from './utils/socketio';
import peers from './utils/peers';

Vue.config.productionTip = false;
/* nothing to do here. This is an entry point file only */

state.init();
socket.init();
peers.init();

new Vue({
  router,
  render: h => h(Layout)
}).$mount('#app');

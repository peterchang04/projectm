import Vue from 'vue';
import Layout from './Layout.vue';
import router from './router';

Vue.config.productionTip = false;
/* nothing to do here. This is an entry point file only */

new Vue({
  router,
  render: h => h(Layout)
}).$mount('#app');

import Vue from 'vue';
import Router from 'vue-router';
// pages
import Home from './components/Home.vue';
import Host from './components/Host.vue';
import Join from './components/Join.vue';
// role pages
import Pilot from './components/views/Pilot.vue';
import Captain from './components/views/Captain.vue';
import Intel from './components/views/Intel.vue';
import Engineer from './components/views/Engineer.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/join',
      component: Join,
    },
    {
      path: '/host',
      component: Host,
    },
    {
      path: '/pilot',
      component: Pilot,
    },
    {
      path: '/engineer',
      component: Engineer,
    },
    {
      path: '/intel',
      component: Intel,
    },
    {
      path: '/captain',
      component: Captain,
    },
  ],
});

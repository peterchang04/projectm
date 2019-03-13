import Vue from 'vue';
import Router from 'vue-router';
import PageA from './components/PageA.vue';
import PageB from './components/PageB.vue';
import Home from './components/Home.vue';
import _Pilot from './components/_Pilot.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/pilot',
      component: _Pilot,
    },
    {
      path: '/a',
      name: 'pageA',
      component: PageA,
    },
    {
      path: '/b',
      name: 'pageB',
      component: PageB,
    },
  ],
});

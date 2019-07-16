import Vue from 'vue';
import Router from 'vue-router';
// pages
import Home from './components/Home.vue';
import Host from './components/Host.vue';
import Join from './components/Join.vue';
import Game from './components/views/Game.vue';

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
      path: '/game',
      component: Game,
    },
  ],
});

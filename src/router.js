import Vue from 'vue';
import Router from 'vue-router';
// pages
import Home from './components/views/Home.vue';
import Host from './components/views/Host.vue';
import Join from './components/views/Join.vue';
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

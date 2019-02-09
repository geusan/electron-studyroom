import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '/chairs',
      name: 'chairs-page',
      component: require('@/components/ChairsPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

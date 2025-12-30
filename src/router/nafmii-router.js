import { DefaultRouter } from './default-router';
import Login from '@/views/nafmii/nafmii-login.vue';
import _ from 'lodash';

const nafmiiRouter = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'login-layout',
      isPublic: true,
    },
  },
];

export const NafmiiRouter = _.unionWith(
  nafmiiRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

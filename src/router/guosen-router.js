import CommonClientAuth from '@/views/login/common-client-auth.vue';
import SsoLogin from '@/views/login/sso-login.vue';
import { DefaultRouter } from './default-router';
import _ from 'lodash';

const guosenCustomRouter = [
  {
    path: '/admin',
    name: 'admin',
    component: CommonClientAuth,
    meta: {
      layout: 'login-layout',
      isPublic: true,
    },
  },
  {
    path: '/sso',
    name: 'sso',
    component: SsoLogin,
    meta: {
      layout: 'basic-layout',
      isPublic: true,
    },
  },
];

export const GuosenRouter = _.unionWith(
  guosenCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

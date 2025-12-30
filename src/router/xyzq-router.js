import CommonLogout from '../views/common-logout.vue';
import { DefaultRouter } from './default-router';
import _ from 'lodash';

const xyzqCustomRouter = [
  {
    path: '/logout',
    name: 'logout',
    component: CommonLogout,
    meta: {
      layout: 'basic-layout',
      isPublic: true,
    },
  },
];

export const XyzqRouter = _.unionWith(
  xyzqCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

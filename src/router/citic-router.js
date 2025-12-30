import CommonLogout from '../views/common-logout.vue';
import { DefaultRouter } from './default-router';
import _ from 'lodash';

const citicCustomRouter = [
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

export const CiticRouter = _.unionWith(
  citicCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

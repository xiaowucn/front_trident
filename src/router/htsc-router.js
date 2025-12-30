import { DefaultRouter } from './default-router';
import _ from 'lodash';

const htscCustomRouter = [
  {
    path: '/wrongPermissions',
    name: 'WrongPermissions',
    component: () => import('../views/wrong-permissions.vue'),
    meta: {
      layout: 'basic-layout',
      isPublic: true,
    },
  },
];

export const HtscRouter = _.unionWith(
  htscCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

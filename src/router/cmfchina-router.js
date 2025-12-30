import { DefaultRouter } from './default-router';
import _ from 'lodash';

const cmfchinaCustomRouter = [
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

export const CmfchinaRouter = _.unionWith(
  cmfchinaCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

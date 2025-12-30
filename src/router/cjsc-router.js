import { DefaultRouter } from './default-router';
import _ from 'lodash';

const cjscCustomRouter = [
  {
    path: '/notValidUser',
    name: 'notValidUser',
    component: () => import('../views/not-valid-user.vue'),
    meta: {
      layout: 'basic-layout',
      isPublic: true,
    },
  },
];

export const CjscRouter = _.unionWith(
  cjscCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

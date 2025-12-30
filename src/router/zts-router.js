import { DefaultRouter } from './default-router';
import ProjectList from '@/views/project-list.vue';
import UserManage from '@/views/user-manage.vue';
import _ from 'lodash';

const ztsCustomRouter = [
  {
    path: '/project',
    name: 'project',
    component: ProjectList,
    meta: {
      layout: 'layout',
      isPublic: false,
    },
  },
  {
    path: '/userManage',
    name: 'UserManage',
    component: UserManage,
    meta: {
      layout: 'layout',
      isPublic: false,
    },
  },
];

export const ZtsRouter = _.unionWith(
  ztsCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

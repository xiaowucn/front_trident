import UserManage from '@/views/user-manage.vue';
import { DefaultRouter } from './default-router';
import _ from 'lodash';

const xyzqCustomRouter = [
  {
    path: '/swhy/userManage',
    name: 'swhyUserManage',
    component: UserManage,
    meta: {
      layout: 'layout',
      isPublic: false,
    },
  },
  {
    path: '/swhy/roleManage',
    name: 'swhyRoleManage',
    component: UserManage,
    meta: {
      layout: 'layout',
      isPublic: false,
    },
  },
];

export const swhyRouter = _.unionWith(
  xyzqCustomRouter,
  DefaultRouter,
  (a, b) => a.path === b.path,
);

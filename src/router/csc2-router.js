import CommonClientAuth from '../views/login/common-client-auth.vue';
import Csc2ProjectList from '../views/csc2-project-list.vue';
import Csc2ProjectListGrater from '../views/csc2-project-list-grater.vue';
import UserManage from '../views/user-manage.vue';
import ApprovalManage from '../views/approve-manager.vue';

export const Csc2Router = [
  {
    path: '/login',
    name: 'login',
    component: CommonClientAuth,
    meta: {
      layout: 'login-layout',
      isPublic: true,
    },
  },
  {
    path: '/project',
    name: 'project',
    component: Csc2ProjectList,
    meta: {
      layout: 'csc2-layout',
      isPublic: false,
    },
  },
  {
    path: '/project/grater',
    name: 'projectGrater',
    component: Csc2ProjectListGrater,
    meta: {
      layout: 'csc2-layout',
      isPublic: false,
    },
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: UserManage,
    meta: {
      layout: 'csc2-layout',
      isPublic: false,
    },
  },
  {
    path: '/approvalManage',
    name: 'approvalManage',
    component: ApprovalManage,
    meta: {
      layout: 'csc2-layout',
      isPublic: false,
    },
  },
];

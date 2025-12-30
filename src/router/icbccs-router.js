import CommonClientAuth from '@/views/login/common-client-auth.vue';
import ProjectList from '../views/project-list.vue';
import UserManage from '../components/user-management.vue';

export const IcbccsRouter = [
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
    component: ProjectList,
    meta: {
      layout: 'icbccs-layout',
      isPublic: false,
    },
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: UserManage,
    meta: {
      layout: 'icbccs-layout',
      isPublic: false,
    },
  },
];

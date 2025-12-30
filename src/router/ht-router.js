import Login from '@/views/ht/ht-login.vue';
import HtProjectList from '@/views/ht/ht-project-list.vue';
import BrowserVersion from '@/views/browser-version.vue';
import BrowserDetection from '@/views/browser-detection.vue';
import FaultyWord from '@/views/faulty-word.vue';
import CommonServiceStat from '../views/common-service-stat.vue';
import UserManage from '@/views/user-manage.vue';

export const HtRouter = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: 'ht-layout',
      isPublic: true,
    },
  },
  {
    path: '/project',
    name: 'project',
    component: HtProjectList,
    meta: {
      layout: 'ht-layout',
      isPublic: false,
    },
  },
  {
    path: '/serviceStat',
    name: 'serviceStat',
    component: CommonServiceStat,
    meta: {
      layout: 'ht-layout',
      isPublic: false,
    },
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: UserManage,
    meta: {
      layout: 'ht-layout',
      isPublic: false,
    },
  },
  {
    path: '/departmentUserManageList',
    name: 'departmentUserManageList',
    component: () =>
      import('@/views/department/department-user-manage-list.vue'),
    meta: {
      layout: 'ht-layout',
      isPublic: false,
    },
  },
  {
    path: '/departmentUserManage/:id',
    name: 'departmentUserManage',
    component: () => import('@/views/department/department-user-manage.vue'),
    meta: {
      layout: 'ht-layout',
      isPublic: false,
    },
  },
  {
    path: '/browserVersion',
    name: 'browserVersion',
    component: BrowserVersion,
    meta: {
      layout: 'ht-layout',
      isPublic: true,
    },
  },
  {
    path: '/browserDetection',
    name: 'browserDetection',
    component: BrowserDetection,
    meta: {
      layout: 'basic-layout',
      isPublic: true,
    },
  },
  {
    path: '/faultyWord',
    name: 'faultyWord',
    component: FaultyWord,
    meta: {
      layout: 'ht-layout',
      isPublic: false,
    },
  },
];

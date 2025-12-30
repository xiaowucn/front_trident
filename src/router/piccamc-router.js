import PiccamcLogin from '@/views/piccamc/piccamc-login.vue';
import ProjectList from '@/views/piccamc/piccamc-project-list.vue';
import UserManage from '@/views/user-manage.vue';
import SystemLog from '@/views/system-log.vue';
import BrowserVersion from '@/views/browser-version.vue';
import BrowserDetection from '@/views/browser-detection.vue';
import FaultyWord from '@/views/faulty-word.vue';
import CommonServiceStat from '../views/common-service-stat.vue';
import NotAllowLoginUser from '../views/not-allow-login-user.vue';

export const PiccamcRouter = [
  {
    path: '/login',
    name: 'login',
    component: PiccamcLogin,
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
  {
    path: '/log',
    name: 'log',
    component: SystemLog,
    meta: {
      layout: 'layout',
      isPublic: false,
    },
  },
  {
    path: '/serviceStat',
    name: 'serviceStat',
    component: CommonServiceStat,
    meta: {
      layout: 'layout',
      isPublic: false,
    },
  },
  {
    path: '/browserVersion',
    name: 'browserVersion',
    component: BrowserVersion,
    meta: {
      layout: 'layout',
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
      layout: 'layout',
      isPublic: false,
    },
  },
  {
    path: '/notAllowLoginUser',
    name: 'notAllowLoginUser',
    component: NotAllowLoginUser,
    meta: {
      layout: 'basic-layout',
      isPublic: true,
    },
  },
];

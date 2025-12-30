import CommonClientAuth from '@/views/login/common-client-auth.vue';
import ProjectList from '@/views/project-list.vue';
import BrowserVersion from '@/views/browser-version.vue';
import BrowserDetection from '@/views/browser-detection.vue';
import FaultyWord from '@/views/faulty-word.vue';

export const HtNlRouter = [
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
      layout: 'ht-layout',
      isPublic: false,
    },
  },
];

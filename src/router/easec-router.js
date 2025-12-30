import EasecProjectList from '@/views/easec-project-list.vue';

export const EasecRouter = [
  {
    path: '/project',
    name: 'project',
    component: EasecProjectList,
    meta: {
      layout: 'easec-layout',
      isPublic: true,
    },
  },
];

import { DefaultRouter } from './default-router';

const env = process.env.VUE_APP_DIST;

let router = DefaultRouter.filter(item =>
  ['login', 'project', 'userManage'].includes(item.name),
);
if (env === 'SSE-SCRIBER') {
  router = DefaultRouter.filter(item => item.name !== 'userManage');
}

export const SseRouter = router;

import MszqProjectList from '@/views/mszq-project-list.vue';
import { DefaultRouter } from './default-router';
import _ from 'lodash';

const router = _.cloneDeep(DefaultRouter);
let project = router.find((item) => item.path === '/project');
project.component = MszqProjectList;

export const MszqRouter = router;

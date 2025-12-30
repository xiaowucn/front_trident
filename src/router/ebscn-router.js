import CommonClientAuth from '@/views/login/common-client-auth.vue';
import EBSCNReview from '@/views/ebscn/review.vue';
import EBSCNCompare from '@/views/ebscn/compare.vue';
import EBSCNBankStatement from '@/views/ebscn/bankstatement.vue';
import SystemAccessDetail from '@/views/ebscn/system-access-detail.vue';
import LoginStatView from '@/views/ebscn/login-stat-view.vue';
import SystemInstructions from '@/views/ebscn/system-instructions.vue';
import FaultyRule from '@/views/ebscn/faulty-rule.vue';
import PinyinRule from '@/views/ebscn/pinyin-rule.vue';
import WhiteListRule from '@/views/ebscn/white-list-rule.vue';

const pageMeta = {
  layout: 'ebscn-layout',
  isPublic: false,
};

/**
 * review 对应 AutoDoc iframe
 * compare 对应 Calliper iframe
 * bankstatement 对应 Grater iframe
 * 本地开发，需要把测试环境的 session_id、calliper_session_id 拷贝到 localhost 下
 */
export const ebscnRouter = [
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
    path: '/review',
    name: 'review',
    component: EBSCNReview,
    meta: pageMeta,
  },
  {
    path: '/compare',
    name: 'compare',
    component: EBSCNCompare,
    meta: pageMeta,
  },
  {
    path: '/bankstatement',
    name: 'bankstatement',
    component: EBSCNBankStatement,
    meta: pageMeta,
  },
  {
    path: '/systemAccessDetail',
    name: 'systemAccessDetail',
    component: SystemAccessDetail,
    meta: pageMeta,
  },
  {
    path: '/loginStatistical',
    name: 'loginStatView',
    component: LoginStatView,
    meta: pageMeta,
  },
  {
    path: '/systemInstructions',
    name: 'systemInstructions',
    component: SystemInstructions,
    meta: pageMeta,
  },

  {
    path: '/faultyRule',
    name: 'faultyRule',
    component: FaultyRule,
    meta: pageMeta,
  },
  {
    path: '/pinyinRule',
    name: 'pinyinRule',
    component: PinyinRule,
    meta: pageMeta,
  },
  {
    path: '/whiteListRule',
    name: 'whiteListRule',
    component: WhiteListRule,
    meta: pageMeta,
  },
];

import Layout from './layout.vue';
import LoginLayout from './login-layout.vue';
import HtLayout from './ht-layout.vue';
import BasicLayout from './basic-layout.vue';
import Csc2Layout from './csc2-layout.vue';
import IcbccsLayout from './icbccs-layout.vue';
import EasecLayout from './easec-layout.vue';
import EbscnLayout from './ebscn-layout.vue';
// 非定制化UI，登录页建议统一使用common-layout，详情页建议使用layout（统一处理用户管理和用户登出）

export default function (Vue) {
  Vue.component(`${Layout.name}`, Layout);
  Vue.component(`${LoginLayout.name}`, LoginLayout);
  Vue.component(`${HtLayout.name}`, HtLayout);
  Vue.component(`${BasicLayout.name}`, BasicLayout);
  Vue.component(`${Csc2Layout.name}`, Csc2Layout);
  Vue.component(`${IcbccsLayout.name}`, IcbccsLayout);
  Vue.component(`${EasecLayout.name}`, EasecLayout);
  Vue.component(`${EbscnLayout.name}`, EbscnLayout);
}

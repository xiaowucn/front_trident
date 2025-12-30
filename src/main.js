import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import './element-components.js';
import './icons';
import layout from './layout';
import VueKindergarten from 'vue-kindergarten';
import * as filters from './tools/filter';
import * as directives from './tools/directives';
import perimeters from './perimeters';
import { loginEBSCNSubSystem } from '@/api/ebscn';
import '@paoding-label/vue-image-viewer/dist/common-image-viewer.css';
import {
  getRedirectCustomerURL,
  getSubSystemURL,
} from '@/tools/customer-redirect-url';

// vite-plugin-svg-icons 需要导入虚拟模块来注册所有图标
import 'virtual:svg-icons-register';

const ENV = process.env.VUE_APP_DIST;

if (ENV === 'EBSCN') {
  import(`./styles/ebscn/element-variables.scss`);
}

if (ENV === 'NAFMII') {
  import(`./styles/nafmii/element-variables.scss`);
}

if (ENV === 'CMFCHINA') {
  import(`./styles/cmfchina/element-variables.scss`);
  import('./styles/cmfchina/style.scss');
}

if (ENV === 'HT') {
  import('./assets/font/font.css');
}

if (ENV === 'ICBCCS') {
  import('./styles/icbcs/style.scss');
}

Vue.use(layout);
Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key]);
});

(async function () {
  try {
    if (ENV === 'EASEC') {
      return;
    }

    if (ENV === 'SWHY') {
      const { route } = router.resolve(window.location.hash.slice(1));
      if (route.name) {
        const swhySession = route.query['session_id'];
        store.dispatch('SysInfo/setSwhySession', swhySession);
      }
    }

    if (ENV === 'MSZQ') {
      if (window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const customSystem = urlParams.get('custom_system');
        if (customSystem) {
          store.dispatch('SysInfo/setCustomSystem', customSystem);
        }
        const taskTypes = urlParams.get('task_types');
        if (taskTypes) {
          store.dispatch('SysInfo/setTaskTypes', taskTypes);
        }
      } else {
        const { route } = router.resolve(window.location.hash.slice(1));
        if (route.name) {
          const customSystem = route.query['custom_system'];
          if (customSystem) {
            store.dispatch('SysInfo/setCustomSystem', customSystem);
          }
          const taskTypes = route.query['task_types'];
          if (taskTypes) {
            store.dispatch('SysInfo/setTaskTypes', taskTypes);
          }
        }
      }
    }

    await store.dispatch('SysInfo/getConfig');
    const config = store.getters['SysInfo/config'];
    try {
      await store.dispatch('UserInfo/getLoggStatus');
      const userInfo = store.getters['UserInfo/userInfo'];
      // 是否跳转子系统
      const subSystemURL = getSubSystemURL(config, userInfo);
      if (subSystemURL) {
        window.location.href = subSystemURL;
        return;
      }
    } catch (error) {
      console.error(error);

      const redirectURL = await getRedirectCustomerURL(error);
      if (redirectURL) {
        window.location.href = redirectURL;
        return;
      }
    }

    if (ENV === 'EBSCN') {
      await loginEBSCNSubSystem();
      await store.dispatch('SysInfo/getAutodocConfig'); // 获取解密响应数据 key
    }
  } catch (e) {
    console.log(e);
  }
  Vue.use(VueKindergarten, {
    child: () => {
      return {
        loginUserInfo: store.getters['UserInfo/userInfo'],
        config: store.getters['SysInfo/config'],
        env: ENV,
        router,
      };
    },
  });

  const vueParams = {
    router,
    store,
    perimeters,
    render: (h) => h(App),
  };

  new Vue(vueParams).$mount('#app');
})();

export const config = store.getters['SysInfo/config'];

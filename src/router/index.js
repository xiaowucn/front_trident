import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { DefaultRouter } from './default-router';
import { HtRouter } from './ht-router';
import { XyzqRouter } from './xyzq-router';
import { CiticRouter } from './citic-router';
import { isChromeBrowser } from '@/tools';
import { Csc2Router } from './csc2-router';
import { GuosenRouter } from './guosen-router';
import { HtNlRouter } from './htnl-router';
import { SseRouter } from './sse-router';
import { HtscRouter } from './htsc-router';
import { HtscInvestRouter } from './htsc-invest-router';
import { ZtsRouter } from './zts-router';
import { IcbccsRouter } from './icbccs-router'; //工银瑞信Icbccs
import { MszqRouter } from './mszq-router';
import { ebscnRouter } from './ebscn-router';
import { EasecRouter } from './easec-router';
import { swhyRouter } from './swhy-router';
import { CjscRouter } from './cjsc-router';
import { PiccamcRouter } from './piccamc-router';
import { NafmiiRouter } from './nafmii-router';
import { CmfchinaRouter } from './cmfchina-router';

import { getQueryVariable } from '@/tools/index';
import { getRedirectCustomerURL } from '@/tools/customer-redirect-url';

Vue.use(Router);

let routes = [];
switch (process.env.VUE_APP_DIST) {
  case 'HT': {
    routes = HtRouter;
    break;
  }
  case 'HT_NEW_OA': {
    routes = HtRouter;
    break;
  }
  case 'HTNL': {
    routes = HtNlRouter;
    break;
  }
  case 'XYZQ': {
    routes = XyzqRouter;
    break;
  }
  case 'CITIC': {
    routes = CiticRouter;
    break;
  }
  case 'CITICS-TG': {
    routes = CiticRouter;
    break;
  }
  case 'CSC2': {
    routes = Csc2Router;
    break;
  }
  case 'GUOSEN': {
    routes = GuosenRouter;
    break;
  }
  case 'SSE-AUTODOC': {
    routes = SseRouter;
    break;
  }
  case 'SSE-PDFLUX': {
    routes = SseRouter;
    break;
  }
  case 'SSE-SCRIBER': {
    routes = SseRouter;
    break;
  }
  case 'HTSC': {
    routes = HtscRouter;
    break;
  }
  case 'HTSC-INVEST': {
    routes = HtscInvestRouter;
    break;
  }
  case 'ZTS': {
    routes = ZtsRouter;
    break;
  }
  case 'ICBCCS': {
    routes = IcbccsRouter;
    break;
  }
  case 'MSZQ': {
    routes = MszqRouter;
    break;
  }
  case 'EBSCN': {
    routes = ebscnRouter;
    break;
  }
  case 'EASEC': {
    routes = EasecRouter;
    break;
  }
  case 'SWHY': {
    routes = swhyRouter;
    break;
  }
  case 'CJSC': {
    routes = CjscRouter;
    break;
  }
  case 'PICCAMC': {
    routes = PiccamcRouter;
    break;
  }
  case 'NAFMII': {
    routes = NafmiiRouter;
    break;
  }
  case 'CMFCHINA': {
    routes = CmfchinaRouter;
    break;
  }
  default: {
    routes = DefaultRouter;
    break;
  }
}

const router = new Router({
  routes,
});

router.beforeEach(async (to, from, next) => {
  const env = process.env.VUE_APP_DIST;
  const isLogged = store.getters['UserInfo/isLogged'];
  const htEnvs = ['HT', 'HT_NEW_OA', 'HTSC', 'HTSC-INVEST'];
  if (!isChromeBrowser() && htEnvs.includes(env)) {
    next('/browserDetection');
  } else {
    if (!isLogged) {
      if (to.meta.isPublic) {
        next();
      } else if (env === 'EASEC') {
        next('/project');
      } else {
        const isLocalEnv = window.location.hostname === 'localhost';
        if (isLocalEnv) {
          next('/login');
          return;
        }

        const redirectURL = await getRedirectCustomerURL();
        if (redirectURL) {
          window.location.href = redirectURL;
        } else {
          next(formatPathWithLocationSearch('/login'));
        }
      }
    } else {
      if (to.path === '/login' || to.path === '/') {
        if (env === 'EBSCN') {
          let path = '/review';

          const subSystem = getQueryVariable('sub_system');
          if (subSystem) {
            const routeMap = {
              autodoc: '/review',
              calliper: '/compare',
              grater: '/bankstatement',
            };
            path = routeMap[subSystem];
          }
          next(formatPathWithLocationSearch(path));
        } else {
          next(formatPathWithLocationSearch('/project'));
        }
      } else {
        next();
      }
    }
  }
});

const formatPathWithLocationSearch = path => {
  const search = window.location.search || '';
  if (search) {
    window.history.replaceState({}, '', window.location.pathname);
    path += search;
  }

  return path;
};

export default router;

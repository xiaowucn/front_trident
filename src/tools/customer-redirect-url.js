import store from '@/store';
import router from '@/router';
import {
  canAutoJumpToSubSystem,
  getRedirectSubpath,
  validateExpire,
} from '@/tools/index';
import { baseURL } from '@/tools/request';
import { getOtherSysUrl } from '@/api/sys-info';

// 跳转到客户系统登录地址
export async function getRedirectCustomerURL(errorInfo) {
  const config = store.getters['SysInfo/config'];

  let redirectURL = '';
  // 当前路由为登录页时，不往客户链接跳转，登录页是我们内部的登录页面，需要跳转的客户不需要我们的登录页
  if (window.location.hash.startsWith('#/login')) {
    // pd_env 表示庖丁环境，在测试环境修改 config 文件中 front_config.pd_env = true 配置
    if (config.pd_env) {
      return redirectURL;
    }
  }

  if (errorInfo && errorInfo.status === 306 && errorInfo.data.redirect) {
    redirectURL = errorInfo.data.redirect;
    return redirectURL;
  }

  const env = process.env.VUE_APP_DIST;
  const {
    login_page_url,
    guid,
    redirect,
    sse_redirect_path,
    redirect_subpath,
    customer_login_api,
  } = config;

  const redirectSubpath = getRedirectSubpath(redirect_subpath);

  const urlParams = new URLSearchParams(window.location.search);
  const sysQuery = urlParams.get('sys');
  let origin = urlParams.get('origin');

  if (customer_login_api) {
    let loginURL = '';
    if (env === 'CJSC') {
      if (!config.internal) {
        loginURL = `${window.location.origin}${redirectSubpath}${baseURL}${customer_login_api}`;
      }
    } else {
      loginURL = `${redirectSubpath}${baseURL}${customer_login_api}`;
    }
    if (loginURL && sysQuery && origin) {
      if (!/api/.test(loginURL)) {
        origin = encodeURIComponent(origin);
      }

      loginURL += `?sys=${sysQuery}&origin=${origin}`;
    }
    return loginURL;
  }

  switch (env) {
    case 'SSE-SCRIBER': {
      await SSETokenCheck(config);
      const token = sessionStorage.getItem('token');
      if (!token) {
        redirectURL = `${login_page_url}?guid=${guid}&redirect=${redirect}${sse_redirect_path}`;
      }
      break;
    }
    case 'GUOSEN':
      redirectURL = `${window.location.origin}${redirectSubpath}api/v1/guosen/sso-login?app=trident`;
      break;
    case 'GUOSEN-IT':
      redirectURL = `${
        window.location.origin
      }${redirectSubpath}api/v1/guosen/sso-login?app=${sysQuery || 'trident'}`;

      if (origin) {
        redirectURL += `&origin=${encodeURIComponent(origin)}`;
      }
      break;
    case 'CTSEC':
      redirectURL = `${window.location.origin}${redirectSubpath}api/v1/ctsec/cas-login`;
      break;
    case 'MSZQ': {
      const taskTypes = store.getters['SysInfo/taskTypes'];
      if (taskTypes) {
        urlParams.set('task_types', taskTypes);
      }
      redirectURL = `${window.location.origin}${redirectSubpath}api/v1/user/cas-login`;

      if (urlParams.toString()) {
        redirectURL += `?${urlParams.toString()}`;
      }
      break;
    }
  }
  return redirectURL;
}

/**
 * 上交所统一认证平台登录流程
 * Step.0 检查sessionStorage中有无token，若无则重定向到统一认证平台
 * Step.1 从重定向后的url参数上获取一次性token(以S|开头)
 * Step.2 用一次性token换取多次查询token(以I|开头)，并将其值存入sessionStorage
 * Step.3 用多次查询token去调用 sse/token-login 接口，在trident系统中注册用户登录
 */
async function SSETokenCheck(config) {
  const urlSearch = window.location.search;
  if (/^token/.test(urlSearch.slice(1))) {
    const token = urlSearch
      .slice(1)
      .split('&')[0]
      .split('=')[1];
    const { guid, service_address } = config;
    const tokenCheckData = {
      id: new Date().getTime(),
      params: {
        guid,
        token: decodeURIComponent(token),
      },
    };
    try {
      const res = await store.dispatch('SysInfo/tokenCheck', {
        url: service_address,
        data: tokenCheckData,
      });
      if (res && res.result) {
        const permanentToken = res.result.token;
        sessionStorage.setItem('token', permanentToken);
      }
      await store.dispatch('SysInfo/tokenLogin', {
        token: sessionStorage.getItem('token'),
      });
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  }
}

export function getSubSystemURL(config, userInfo) {
  let stopJump, originQuery, autoJump, sysQuery;

  if (window.location.search) {
    const urlQuery = new URLSearchParams(window.location.search);

    stopJump = urlQuery.get('stop_jump');
    originQuery = urlQuery.get('origin');
    autoJump = urlQuery.get('auto_jump');
    sysQuery = urlQuery.get('sys');
  } else {
    const { route } = router.resolve(window.location.hash.slice(1));

    if (route.name) {
      stopJump = route.query['stop_jump'];
      originQuery = route.query['origin'];
      autoJump = route.query['auto_jump'];
      sysQuery = route.query['sys'];
    }
  }

  if (canAutoJumpToSubSystem(config, userInfo) || (autoJump && sysQuery)) {
    const roles = userInfo.roles;
    if (!roles || roles.length === 0 || stopJump) {
      return '';
    }
    const permissions = roles[0].permission;
    const sysNames = Object.keys(permissions).filter(
      item => permissions[item].length !== 0,
    );
    let sysName = '';
    if (sysQuery) {
      sysName = sysQuery;
    } else if (sysNames.length === 1) {
      sysName = sysNames[0];
    }
    if (sysName) {
      if (validateExpire(config, sysName)) {
        return '';
      }
      return getOtherSysUrl(sysName, originQuery);
    }
  }
  return '';
}

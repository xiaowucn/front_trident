import request from '@/tools/request';
import { baseURL } from '@/tools/request';

const isCscEnv = process.env.VUE_APP_DIST === 'CSC';
const isHtEnv =
  process.env.VUE_APP_DIST === 'HT' || process.env.VUE_APP_DIST === 'HT_NEW_OA';

export const getAvailableSys = () => {
  return request({
    url: '/available-sys',
    headers: {
      isDecrypt: isCscEnv,
    },
  });
};

export const getCSRFtoken = params => {
  return request({
    url: '/csrf_token',
    params,
  });
};

export const getOtherSysUrl = (sysName, origin, taskTypes) => {
  const query = {};

  const searchOriginal = window.location.href.split('?')[1];
  if (searchOriginal) {
    searchOriginal.split('&').forEach(queryItem => {
      const [key, value] = queryItem.split('=');
      query[key] = value;
    });
  }

  query.sys = sysName;
  if (origin) {
    query.origin = origin;
  }

  if (taskTypes) {
    query.autodoc_task_types = taskTypes;
  }

  let url = `${baseURL}/get-off?${Object.keys(query)
    .map(key => `${key}=${window.encodeURIComponent(query[key])}`)
    .join('&')}`;
  if (sysName === 'grater' && isHtEnv) {
    url = `${baseURL}/ht/external-system?sys=grand`;
  }
  return url;
};

export const getCommonServiceStat = params => {
  return request({
    url: '/visit-stat',
    params,
  });
};

export const getConfig = () => {
  let url = '/config';
  const VUE_APP_DIST = process.env.VUE_APP_DIST;
  if (['SSE-AUTODOC', 'SSE-PDFLUX', 'SSE-SCRIBER'].includes(VUE_APP_DIST)) {
    url = '/sse/config';
  }
  return request({ url });
};

// 上交所统一认证平台用一次性token换取多次查询token
export const tokenCheck = (url, data) => {
  return request({
    url,
    method: 'POST',
    data,
  });
};

// 上交所在trident系统中注册用户登录
export const tokenLogin = token => {
  return request({
    url: '/sse/token-login',
    method: 'POST',
    data: token,
  });
};

export const createApprovalSystem = data => {
  return request({
    url: '/system/require',
    method: 'POST',
    data,
  });
};

export const getApprovalList = params => {
  return request({
    url: '/sys-requires',
    params,
  });
};

export const updateApprovalItem = (id, data) => {
  return request({
    url: `/require/${id}`,
    method: 'PUT',
    data,
  });
};

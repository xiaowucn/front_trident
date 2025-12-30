import request, { baseURL } from '@/tools/request';

const isCscEnv = process.env.VUE_APP_DIST === 'CSC';

export const ldapLogin = data => {
  return request({
    url: '/user/ldap-login',
    method: 'POST',
    data,
  });
};

export const htNewOaLogin = data => {
  return request({
    url: '/ht/esb-login',
    method: 'POST',
    data,
  });
};

export const checkLdapLogin = data => {
  return request({
    url: '/user/check-auth',
    method: 'POST',
    data,
  });
};

export const fetchVerifyCode = data => {
  return request({
    url: '/user/auth-code',
    method: 'POST',
    data,
  });
};

export const htnlLogin = data => {
  return request({
    url: '/user/login',
    method: 'POST',
    data,
  });
};

export const login = (url, data) => {
  return request({
    url,
    method: 'POST',
    headers: {
      isEncrypt: isCscEnv,
      isDecrypt: isCscEnv,
    },
    data,
  });
};

export const getUserInfo = () => {
  return request({
    url: '/user/me',
    headers: {
      isEncrypt: isCscEnv,
      isDecrypt: isCscEnv,
    },
  });
};

export const logout = params => {
  return request({
    url: '/user/logout',
    params,
  });
};

export const getCaptcha = () => {
  return request({
    url: '/captcha',
    params: {
      time: new Date().getTime(),
    },
  });
};

/**
 * 当前接口会返回302,重定向到 https://casgbk.csc108.com/logout 所以需要处理跨域
 */
export const cscLogout = () => `${baseURL}/user/cas-logout`;

// 上交所提供登出api
export const sseLogout = (logoutUrl, data) => {
  return request({
    url: logoutUrl,
    method: 'POST',
    data,
  });
};

export const resetUserPassword = data => {
  return request({
    url: '/user/password',
    method: 'PUT',
    data,
  });
};

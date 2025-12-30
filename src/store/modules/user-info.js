import {
  getUserInfo,
  login,
  ldapLogin,
  logout,
  getCaptcha,
  htnlLogin,
  sseLogout,
  htNewOaLogin,
} from '@/api/login';
import { getCSRFtoken } from '@/api/sys-info';
const state = {
  isLogged: false,
  userInfo: {},
  csrfToken: '',
  captcha: '',
};

const getters = {
  isLogged: state => state.isLogged,
  userInfo: state => state.userInfo,
  csrfToken: state => state.csrfToken,
  captcha: state => state.captcha,
};

const mutations = {
  SET_IS_LOGGED: (state, status) => {
    state.isLogged = status;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_TOKEN: (state, csrfToken) => {
    state.csrfToken = csrfToken;
  },
  SET_CAPTCHA: (state, captcha) => {
    state.captcha = captcha;
  },
};

const actions = {
  async getLoggStatus({ commit }) {
    try {
      const { data } = await getUserInfo();
      commit('SET_USER_INFO', data);
      commit('SET_IS_LOGGED', true);
      return data;
    } catch (error) {
      commit('SET_IS_LOGGED', false);
      return Promise.reject(error);
    }
  },
  async login(
    state,
    { uid, password, org_code, captcha, url = '/user/login' },
  ) {
    const data = {
      username: uid,
      password,
    };
    if (org_code) {
      data.org_code = org_code;
    }
    if (captcha) {
      data.captcha = captcha;
    }
    return await login(url, data);
  },
  async htnlLogin(state, { uid, password }) {
    return await htnlLogin({
      name: uid,
      password: password,
    });
  },

  async ldapLogin(
    state,
    { uid, password, captcha, csrfToken, verifyCode, mobile },
  ) {
    const params = {
      uid: uid,
      password: password,
      csrf_token: csrfToken,
    };
    if (captcha) {
      params.captcha = captcha;
    }
    if (verifyCode) {
      params.phone = mobile;
      params.auth_code = verifyCode;
    }
    return await ldapLogin(params);
  },

  async htLoginByNewOA(state, params) {
    const resp = await htNewOaLogin(params);
    return resp;
  },

  async getCSRFtoken({ commit }) {
    const res = await getCSRFtoken();
    commit('SET_TOKEN', res.data.csrf_token);
  },
  async getCaptcha({ commit }) {
    const res = await getCaptcha();
    commit('SET_CAPTCHA', res.data.captcha);
  },
  async logout({ rootState, commit }) {
    const params = {};
    const customSystem = rootState.SysInfo.customSystem;
    if (customSystem) {
      params.custom_system = customSystem;
    }
    const res = await logout(params);
    commit('UserInfo/SET_IS_LOGGED', false, { root: true });
    return res;
  },
  async sseLogout({ commit }, { url, data }) {
    const res = await sseLogout(url, data);
    commit('UserInfo/SET_IS_LOGGED', false, { root: true });
    return res;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

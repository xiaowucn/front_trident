import {
  getAvailableSys,
  getConfig,
  tokenCheck,
  tokenLogin,
} from '@/api/sys-info';
import { getAutodocConfig } from '@/api/ebscn';
const state = {
  availableSys: [],
  config: {},
  autodocConfig: {},
  swhySession: '',
  customSystem: '',
  taskTypes: '',
};

const getters = {
  availableSys: state => state.availableSys,
  config: state => state.config,
  autodocConfig: state => state.autodocConfig,
  swhySession: state => state.swhySession,
  customSystem: state => state.customSystem,
  taskTypes: state => state.taskTypes,
};

const mutations = {
  SET_AVAILABLE_SYS: (state, availableSys) => {
    state.availableSys = availableSys;
  },
  SET_CONFIG: (state, config) => {
    state.config = config;
  },
  SET_AUTODOC_CONFIG: (state, config) => {
    state.autodocConfig = config;
  },
  SET_SWHY_SESSION(state, data) {
    state.swhySession = data;
  },
  SET_CUSTOM_SYSTEM(state, data) {
    state.customSystem = data;
  },
  SET_TASK_TYPES(state, data) {
    state.taskTypes = data;
  },
};

const actions = {
  async getAvailableSys({ commit }) {
    const res = await getAvailableSys();
    commit('SET_AVAILABLE_SYS', res.data);
  },
  async getConfig({ commit }) {
    const res = await getConfig();
    commit('SET_CONFIG', res.data);
  },
  async getAutodocConfig({ commit }) {
    const res = await getAutodocConfig();
    commit('SET_AUTODOC_CONFIG', res.data);
  },
  async tokenCheck(context, { url, data }) {
    return await tokenCheck(url, data);
  },
  async tokenLogin(context, token) {
    return await tokenLogin(token);
  },
  setSwhySession({ commit }, data) {
    commit('SET_SWHY_SESSION', data);
  },
  setCustomSystem({ commit }, data) {
    commit('SET_CUSTOM_SYSTEM', data);
  },
  setTaskTypes({ commit }, data) {
    commit('SET_TASK_TYPES', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

import Vue from 'vue';
import Vuex from 'vuex';
import UserInfo from './modules/user-info';
import SysInfo from './modules/sys-info';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    UserInfo,
    SysInfo,
  },
  state: {},
  mutations: {},
  actions: {},
});

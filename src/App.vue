<template>
  <div id="app">
    <component :is="layout"></component>

    <sub-system-logout v-if="isLogoutSubSys" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { getSystemInfo } from './tools/env-system';
import SubSystemLogout from './components/sub-system-logout.vue';
import { EventBus } from './tools/event-bus';
import { getSubSystemURL } from '@/tools/customer-redirect-url';
import {
  citicsTgCommonProjectInfo,
  CITICS_TG_HIDE_PERM,
} from './tools/constants';

const AUTODOC = 'autodoc';

export default {
  components: { SubSystemLogout },
  provide() {
    return {
      getSystemsList: () => this.systemList,
      systemsByPermission: () => this.systemsByPermission,
    };
  },
  data() {
    return {
      isLogoutSubSys: false,
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['userInfo', 'isLogged']),
    systemsByPermission() {
      if (!_.isEmpty(this.config) && !_.isEmpty(this.userInfo)) {
        if (this.$platform.isIcbccsEnv()) {
          // 工银瑞信单点登录子系统权限用customer_permissions判断
          if (this.userInfo.user_data.customer_permissions) {
            const userPermissions =
              this.userInfo.user_data.customer_permissions;
            return _.intersection(this.openSystemByConfig, userPermissions);
          }
        }
        if (this.userInfo.roles && this.userInfo.roles[0].permission) {
          const userPermissions = this.userInfo.roles[0].permission;
          const allowSystemKeys = Object.keys(userPermissions).filter(
            (per) => userPermissions[per].length > 0,
          );

          return _.intersection(this.openSystemByConfig, allowSystemKeys);
        }
      }
      return [];
    },
    openSystemByConfig() {
      if (!_.isEmpty(this.config)) {
        return Object.keys(this.config)
          .filter((key) => key.endsWith('_open') && this.config[key])
          .map((item) => {
            const systemKey = item.split('_open')[0];
            if (systemKey === 'list') {
              return AUTODOC;
            }
            if (systemKey === 'overall') {
              return `${AUTODOC}_${systemKey}`;
            }
            return systemKey;
          });
      }
      return [];
    },
    layout() {
      return this.$route.meta.layout;
    },
    systemList() {
      let list = [];
      const envSystemInfo = getSystemInfo(this.config.sys);
      this.systemsByPermission.forEach((systemKey) => {
        const currentSysInfo = envSystemInfo.find(
          (item) => item.sysName === systemKey,
        );
        let formatSystemKey = systemKey;
        if (systemKey === 'autodoc') {
          formatSystemKey = 'list';
        }
        if (systemKey === 'autodoc_overall') {
          formatSystemKey = 'overall';
        }
        let sysTitle = `${formatSystemKey}_title`;
        let systemItemInfo = {
          name: this.config[sysTitle],
          sysName: systemKey,
        };
        if (currentSysInfo) {
          systemItemInfo = Object.assign(systemItemInfo, currentSysInfo);
        } else {
          // 设置未定制图标，但开启的系统
          systemItemInfo.icon = 'default-system';
        }

        const configCaptions = this.config[`${formatSystemKey}_captions`];
        if (configCaptions) {
          systemItemInfo.captions = configCaptions;
        }
        if (this.$platform.isCiticsTgEnv() && systemKey === 'scriber') {
          const { roles } = this.userInfo;
          if (
            roles[0].permission.scriber.length <= CITICS_TG_HIDE_PERM.length &&
            (!roles[0].role_data ||
              _.isEmpty(roles[0].role_data.parameter_permission))
          ) {
            systemItemInfo = null;
          } else if (
            !roles[0].role_data ||
            !roles[0].role_data.parameter_permission
          ) {
            systemItemInfo = {
              ...systemItemInfo,
              ...citicsTgCommonProjectInfo,
            };
          }
        }

        if (systemItemInfo) {
          list.push(systemItemInfo);
        }
      });

      // if (this.$platform.isCiticsEnv()) {
      //   list.push({
      //     captions: '',
      //     hoverIcon: 'citic-custom-hover',
      //     icon: 'citic-custom',
      //     name: '债券募集资金使用用途核查',
      //     url: 'https://aidoc.citicsinfo.com/bfund/',
      //   });
      // }

      return list;
    },
  },
  watch: {
    async isLogged() {
      if (this.isLogged) {
        this.isLogoutSubSys = false;
        this.fetchAvailableSys();
        // 是否跳转子系统
        const subSystemURL = getSubSystemURL(this.config, this.userInfo);
        if (subSystemURL) {
          window.location.href = subSystemURL;
        }
      }
    },
    $route() {
      try {
        this.$store.dispatch('UserInfo/getLoggStatus');
      } catch (error) {
        if (error.status === 306) {
          if (error.data.redirect) {
            window.location.href = error.data.redirect;
          }
        }
      }
    },
  },
  async created() {
    if (this.isLogged) {
      if (this.$platform.isCCZQEnv()) {
        const sessionKey = sessionStorage.getItem('cczq-session-security');
        if (!sessionKey) {
          await this.$store.dispatch('UserInfo/logout');
          location.reload();
          return;
        }
      }
      this.fetchAvailableSys();
    }
    EventBus.$on('logout-sub-systems', this.onLogoutSubSystems);
  },
  beforeDestroy() {
    EventBus.$off('logout-sub-systems', this.onLogoutSubSystems);
  },
  methods: {
    onLogoutSubSystems() {
      this.isLogoutSubSys = true;
    },
    async fetchAvailableSys() {
      try {
        await this.$store.dispatch('SysInfo/getAvailableSys');
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
::-ms-reveal {
  display: none;
}
</style>

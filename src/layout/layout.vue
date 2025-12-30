<template>
  <div class="layout-wrapper" :class="containerClass">
    <header v-if="!isSWHYXyzEnv" class="header-wrapper">
      <div class="header-left">
        <img
          v-if="isShowLogo"
          class="logo"
          :src="logoUrl"
          alt="logo"
          @click="$router.push('/')" />
        <template v-if="isHTAMCEnv">
          <img src="../assets/img/htamc-vline.svg" alt="vline" class="vline" />
          <img src="../assets/img/htamc-arrow.svg" alt="arrow" class="arrow" />
          <img src="../assets/img/htamc-abs.svg" alt="abs" class="abs" />
          <img src="../assets/img/htamc-vline.svg" alt="vline" class="vline" />
        </template>
      </div>

      <div class="header-right">
        <div class="common-content">
          <router-link
            v-if="$features.isShowHome()"
            :to="'/project'"
            class="header-nav home-title">
            {{ homeLinkName }}
          </router-link>
          <router-link
            v-if="$features.isShowUserManager()"
            class="user-manager-btn header-nav"
            to="/userManage">
            用户管理
          </router-link>
        </div>
        <router-link
          v-if="$features.isShowSystemLog()"
          to="/log"
          class="header-nav">
          系统日志
        </router-link>
        <el-dropdown
          v-if="isShowDropdownMenu"
          class="user-info"
          @command="handleCommand">
          <span>
            <img
              v-if="isHTAMCEnv"
              src="../assets/img/htamc-avatar.svg"
              class="user-avatar"
              alt="" />
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="isShowPassword" command="password">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item v-if="isShowLogout" command="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="user-info">
          {{ userInfo.user_data.username || userInfo.ext_uname }}
        </div>
      </div>
    </header>

    <div v-if="isShowNavBg" class="nav-bg">
      <img :src="navBgUrl" alt="nav-bg" />
    </div>

    <update-password-dialog v-if="isDialogVisible" @close-dialog="closeDialog">
    </update-password-dialog>

    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { isIPAddress, getRedirectURL, getRedirectSubpath } from '@/tools/index';
import UpdatePasswordDialog from '@/components/update-password-dialog.vue';
import { EventBus } from '../tools/event-bus';
import { getRedirectCustomerURL } from '@/tools/customer-redirect-url';

const logoImages = import.meta.glob('../assets/img/**/*.{png,svg,jpg,jpeg}', {
  eager: true,
  import: 'default',
});

// 获取图片路径的辅助函数
function getImage(path) {
  const normalizedPath = path.startsWith('../assets/img/')
    ? path
    : `../assets/img/${path.replace(/^\.\.\/assets\/img\//, '')}`;

  // 尝试直接匹配
  if (logoImages[normalizedPath]) {
    return logoImages[normalizedPath];
  }

  // 如果直接匹配失败，尝试查找包含该文件名的路径
  const fileName = normalizedPath.split('/').pop();
  const matchedKey = Object.keys(logoImages).find((key) =>
    key.endsWith(fileName),
  );
  return matchedKey ? logoImages[matchedKey] : '';
}

export default {
  name: 'Layout',
  components: {
    UpdatePasswordDialog,
  },
  data() {
    return {
      isDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    ...mapGetters('SysInfo', ['config']),
    isShowLogo() {
      // Hide logo when VUE_APP_FAVICON is set to pai-favicon.ico
      if (process.env.VUE_APP_FAVICON === 'pai-favicon.ico') {
        return false;
      }

      return (
        this.isCgsEnv ||
        this.isXyzqEnv ||
        this.isCiticEnv ||
        this.isZtsEnv ||
        this.isHtNlEnv ||
        this.isCmsEnv ||
        this.isHTAMCEnv ||
        this.isCuamEnv ||
        this.isFULLGOALEnv ||
        this.isPICCAMCEnv ||
        this.isWESTEnv
      );
    },
    isShowNavBg() {
      return this.isCmsEnv || this.isCuamEnv || this.isCiticEnv;
    },
    containerClass() {
      return this.config.sys;
    },
    userName() {
      const name = this.userInfo.user_data.username || this.userInfo.ext_uname;
      if (this.isGTJAEnv) {
        return `${name}（${
          this.userInfo.user_data.staff_id || this.userInfo.ext_uname || ''
        }）`;
      }
      return name;
    },
    logoUrl() {
      if (this.isCgsEnv) {
        return getImage('../assets/img/cgs-logo.png');
      } else if (this.isXyzqEnv) {
        return getImage('../assets/img/xyzq-logo.png');
      } else if (this.isCiticEnv) {
        return getImage('../assets/img/citic-logo.png');
      } else if (this.isZtsEnv) {
        return getImage('../assets/img/zts-logo.png');
      } else if (this.isHtNlEnv) {
        return getImage('../assets/img/ht-logo.png');
      } else if (this.isCmsEnv) {
        return getImage('../assets/img/cms/logo.png');
      } else if (this.isCuamEnv) {
        return getImage('../assets/img/htffund/cuam-logo.png');
      } else if (this.isHTAMCEnv) {
        return getImage('../assets/img/htamc-logo.png');
      } else if (this.isFULLGOALEnv) {
        return getImage('../assets/img/fullgoal-logo.svg');
      } else if (this.isPICCAMCEnv) {
        return getImage('../assets/img/piccamc-logo.svg');
      } else if (this.isWESTEnv) {
        return getImage('../assets/img/west-logo.svg');
      } else {
        return '';
      }
    },
    navBgUrl() {
      if (this.isCmsEnv) {
        return getImage('../assets/img/cms/nav-bg.png');
      } else if (this.isCuamEnv) {
        return getImage('../assets/img/htffund/nav-bg.png');
      } else if (this.isCiticEnv) {
        return getImage('../assets/img/citic-banner.png');
      } else {
        return '';
      }
    },
    isCuamEnv() {
      return this.$platform.isCuamEnv();
    },
    isZtsEnv() {
      return this.$platform.isZtsEnv();
    },
    isHtNlEnv() {
      return this.$platform.isHtNlEnv();
    },
    isCscEnv() {
      return this.$platform.isCscEnv();
    },
    isCmsEnv() {
      return this.$platform.isCmsEnv();
    },
    isCgsEnv() {
      return this.$platform.isCgsEnv();
    },
    isMszqEnv() {
      return this.$platform.isMszqEnv();
    },
    isCiccEnv() {
      return this.$platform.isCiccEnv();
    },
    isCiticEnv() {
      return this.$platform.isCiticEnv();
    },
    isCiticsTgEnv() {
      return this.$platform.isCiticsTgEnv();
    },
    isGTJAEnv() {
      return this.$platform.isGtjaEnv();
    },
    isSwscEnv() {
      return this.$platform.isSwscEnv();
    },
    isHtscEnv() {
      return this.$platform.isHtscEnv();
    },
    isXyzqEnv() {
      return this.$platform.isXyzqEnv();
    },
    isNescEnv() {
      return this.$platform.isNescEnv();
    },
    isSzseEnv() {
      return this.$platform.isSzseEnv();
    },
    isSseEnv() {
      return this.$platform.isSseEnv();
    },
    isGuosenEnv() {
      return this.$platform.isGuosenEnv();
    },
    isCSCOEnv() {
      return this.$platform.isCSCOEnv();
    },
    isJHZQEnv() {
      return this.$platform.isJHZQEnv();
    },
    isHTAMCEnv() {
      return this.$platform.isHTAMCEnv();
    },
    isFULLGOALEnv() {
      return this.$platform.isFULLGOALEnv();
    },
    isPICCAMCEnv() {
      return this.$platform.isPICCAMCEnv();
    },
    isWESTEnv() {
      return this.$platform.isWESTEnv();
    },
    isSWHYXyzEnv() {
      return this.$platform.isSWHYEnv() && /swhy/.test(this.$route.path);
    },
    isShowDropdownMenu() {
      return this.isShowPassword || this.isShowLogout;
    },
    isShowPassword() {
      return this.$features.isShowUpdateUserPassword();
    },
    isShowLogout() {
      return !this.isCSCOEnv;
    },
    homeLinkName() {
      if (this.isCgsEnv) {
        return '首页';
      } else if (this.isSzseEnv) {
        return '自然语言处理平台';
      } else if (this.isCscEnv) {
        return '信息抽取';
      } else if (this.isFULLGOALEnv) {
        return '智能文档';
      } else {
        return '平台首页';
      }
    },
    needLogoutToLoginClient() {
      const userPermissions = this.userInfo.permissions || [];
      return (
        (this.isHtscEnv && isIPAddress()) ||
        ((this.isMszqEnv || this.isGuosenEnv) &&
          userPermissions.includes('p_manage')) ||
        (this.isCuamEnv && this.userInfo.oa_user === false) ||
        (this.isCmsEnv && this.$features.isSelfSystemAdmin()) ||
        this.isJHZQEnv
      );
    },
  },
  methods: {
    handleCommand(command) {
      if (command === 'password') {
        this.isDialogVisible = true;
      } else if (command === 'logout') {
        this.logout();
      }
    },
    closeDialog() {
      this.isDialogVisible = false;
    },
    async logoutSseClient() {
      try {
        // 上交所登出
        const { login_page_url, logout_url, guid, redirect } = this.config;
        if (!logout_url) {
          await this.$store.dispatch('UserInfo/logout');
          location.reload();
        } else {
          const logoutData = {
            id: new Date().getTime(),
            params: {
              token: sessionStorage.getItem('token'),
            },
          };
          await this.$store.dispatch('UserInfo/sseLogout', {
            url: logout_url,
            data: logoutData,
          });
          sessionStorage.removeItem('token');
          window.location.href = `${login_page_url}?guid=${guid}&redirect=${redirect}`;
        }
      } catch (error) {
        this.$notify.error('退出登录失败');
      }
    },
    async logout() {
      try {
        EventBus.$emit('logout-sub-systems');
        await this.$nextTick();
        const { data } = await this.$store.dispatch('UserInfo/logout');
        if (this.needLogoutToLoginClient) {
          this.$router.push('login');
          return;
        }

        if (this.isSseEnv) {
          this.logoutSseClient();
          return;
        }

        if (this.isXyzqEnv) {
          this.$router.push({
            name: 'logout',
          });
          return;
        }

        if (this.isNescEnv) {
          if (this.$features.isAdmin()) {
            this.$router.push('/login');
          } else {
            window.location.href = `${getRedirectSubpath(
              this.config.redirect_subpath,
            )}api/v1/nesc/jwt-login`;
          }
          return;
        }

        if (this.isCiticEnv || this.isCiticsTgEnv) {
          if (this.userInfo.user_data.ext_sys.includes('citics')) {
            this.$router.push({
              name: 'logout',
            });
          } else {
            location.reload();
          }
          return;
        }

        if (data.redirect_url) {
          location.href = getRedirectURL(
            this.config.redirect_subpath,
            data.redirect_url,
          );
          return;
        }

        const redirectURL = await getRedirectCustomerURL();
        if (redirectURL) {
          window.location.href = redirectURL;
        } else {
          location.reload();
        }
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  box-sizing: border-box;
  background-image: url('../assets/img/kysec-bg.jpg');
  background-size: cover;
  text-align: left;
  &.xyzq {
    background-image: url('../assets/img/xyzq-bg.png');
    .header-wrapper {
      background: #ffffff;
      .header-right {
        .user-manager-btn,
        .user-info {
          color: #606266;
        }
      }
    }
    .logo {
      width: 145px;
    }
  }
  &.cicc {
    background-image: url('../assets/img/cicc-bg.png');
  }
  &.szse,
  &.swse,
  &.htnl,
  &.csc,
  &.guosen {
    background-image: url('../assets/img/ht-login-background.png');
  }
  &.cms,
  &.htffund {
    background-image: none;
    background-color: #f6f7f8;
    .nav-bg {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &.cms {
    .logo {
      width: 150px;
    }
    .nav-bg {
      height: 42%;
    }
    .header-wrapper {
      background: #ffffff;
      .header-right .user-info {
        color: #606266;
      }
    }
  }
  &.fullgoal {
    background-image: url('../assets/img/fullgoal-background.svg');
    .logo {
      width: 120px;
    }
    .header-wrapper {
      padding: 0 32px;
      background: #1358c00f;
      .header-right {
        .home-title,
        .user-manager-btn,
        .user-info {
          color: #212225;
        }
        .home-title,
        .user-manager-btn {
          position: relative;
          &::before {
            position: absolute;
            top: 0;
            left: -25px;
          }
        }
        .home-title {
          margin-right: 60px;
          &::before {
            content: url('../assets/img/fullgoal-home.svg');
          }
        }
        .user-manager-btn {
          &::before {
            content: url('../assets/img/fullgoal-user-manager.svg');
          }
        }
      }
    }
  }
  &.htffund {
    .logo {
      width: 420px;
    }
    .nav-bg {
      height: 32%;
    }
    .header-wrapper {
      background: #24233a;
      .header-right .user-info {
        color: #fff;
      }
    }
  }
  &.citics {
    background-image: none;
    .header-wrapper {
      .header-right {
        a {
          color: #303133;
        }
        .user-manager-btn {
          font-size: 15px;
        }
        .user-info {
          color: #303133;
        }
      }
    }
    .nav-bg {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .logo {
      width: 145px;
    }
    .project-container {
      position: initial;
      margin-top: 5vh;
    }
  }
  &.cgs {
    .logo {
      width: 220px;
      margin-top: 15px;
    }
  }
  &.zts {
    .logo {
      width: 120px;
      margin-top: 15px;
    }
  }
  &.htamc {
    background-image: none;
    .header-wrapper {
      background: url('../icons/svg/htamc-background.png') round;
      padding: 0 44px 0 16px;
      height: 64px;
      .header-left {
        margin-right: 20px;
        .logo {
          margin-right: 10px;
        }
        .vline {
          margin-right: 2px;
        }
        .abs {
          margin: 0 10px;
        }
      }
      .header-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .header-nav {
          margin: 0 18px;
          font-size: 14px;
          &.home-title {
            margin-left: 0;
          }
        }
        .user-info {
          font-size: 14px;
          > span {
            display: flex;
            align-items: center;
          }
          .user-avatar {
            margin-right: 10px;
          }
        }
      }
    }
    .logo {
      width: 150px;
    }
  }
  &.cmfchina {
    .header-wrapper {
      display: none;
    }
  }
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 100px;
    .header-left {
      display: flex;
      justify-content: center;
      align-items: center;
      .logo {
        cursor: pointer;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .common-content {
        display: flex;
        align-items: center;
      }
      .header-nav {
        margin-right: 35px;
        font-size: 16px;
        color: #ffffff;
        text-decoration: none;
        cursor: pointer;
      }
      .user-info {
        font-size: 16px;
        color: #fff;
      }
    }
  }
  .user-management-wrapper {
    margin: 30px 100px;
    &.cmfchina {
      min-height: calc(100% - 40px);
      margin: 0;
      padding: 20px;
      .user-management-tabs {
        padding: 0;
      }
    }
  }
}
</style>

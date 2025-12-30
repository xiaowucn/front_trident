<template>
  <div class="view-layout-wrapper">
    <div class="view-header-container">
      <div class="view-header-wrapper">
        <div class="header-left-container" @click="goHome">
          <img
            class="logo-content"
            src="@/assets/img/ebscn-logo-black-text.png"
            alt="ebscn-logo" />
          <span class="describe-content">智能平台</span>
        </div>
        <el-tabs
          v-if="subSystem"
          v-model="subSystem"
          class="view-header-tabs-wrapper"
          @tab-click="switchSystemTab">
          <el-tab-pane label="文档智能审核" name="review"> </el-tab-pane>
          <el-tab-pane label="文档智能比对" name="compare"> </el-tab-pane>
          <el-tab-pane label="银行流水识别" name="bankstatement"> </el-tab-pane>
        </el-tabs>
        <div class="header-right-container">
          <div class="text-wrapper" @click="routerGo('systemInstructions')">
            系统使用说明
          </div>

          <div class="user-avatar">
            {{ userInfo.ext_uname.substring(0, 1).toUpperCase() }}
          </div>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              {{ userInfo.ext_uname }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="isAdmin" command="loginStatView">
                用户登录情况
              </el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" command="systemAccessDetail">
                系统访问明细
              </el-dropdown-item>
              <el-dropdown-item command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="view-main" :class="{ 'sub-system': subSystem }">
      <router-view v-if="!reloadingChildRoute"></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '../tools/event-bus';

export default {
  name: 'EbscnLayout',
  data() {
    return {
      subSystem: 'review',
      isLogoutSubSys: false,
      reloadingChildRoute: false,
      userAvatar: '',
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo', 'isLogged']),
    ...mapGetters('SysInfo', ['autodocConfig']),
    isAdmin() {
      return this.$features.isAdmin();
    },
    routeName() {
      return this.$route.name;
    },
  },
  watch: {
    routeName() {
      this.checkCurrentSystem();
    },
  },
  created() {
    this.checkCurrentSystem();

    const self = this;
    window.addEventListener('message', (e) => {
      const { from, event, data } = e.data;
      if (['autodoc', 'calliper', 'grater'].includes(from)) {
        if (event === 'logout') {
          self.logout();
        }

        if (event === 'changeRoute' && data.routeName) {
          self.$router.push({ name: data.routeName });
        }
      }
    });
  },
  methods: {
    async switchSystemTab() {
      const routeName = this.subSystem;

      if (routeName === this.$route.name) {
        this.reloadingChildRoute = true;
        await this.$nextTick();
        this.reloadingChildRoute = false;
      } else {
        this.$router.push({ name: routeName });
      }
    },
    checkCurrentSystem() {
      this.subSystem = this.$route.name;
      document.title = process.env.VUE_APP_TITLE;
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;

        default:
          this.routerGo(command);
          break;
      }
    },
    async logout() {
      try {
        EventBus.$emit('logout-sub-systems');
        await this.$nextTick();
        await this.$store.dispatch('UserInfo/logout');
        this.$router.push({ name: 'login' });
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    goHome() {
      this.subSystem = 'review';
      this.switchSystemTab();
    },
    routerGo(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style scoped lang="scss">
.view-layout-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.view-header-container {
  position: sticky;

  .view-header-wrapper {
    height: 60px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    .header-left-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      .logo-content {
        height: 40px;
      }
      .describe-content {
        font-size: 26px;
        font-weight: 700;
        font-family: 'Microsoft YaHei', serif;
        margin-left: 12px;
      }
    }
    .header-right-container {
      display: flex;
      align-items: center;
      font-size: 15px;
      .user-avatar {
        border-radius: 50%;
        margin-left: 25px;
        font-size: 20px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-weight: 500;
        background: #885eff;
        text-align: center;
        color: #fff;
      }
      .text-wrapper {
        margin-right: 20px;
        font-size: 15px;
        cursor: pointer;
        &:hover {
          color: #a498e8;
        }
      }
      .user-info {
        margin-left: 12px;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        &:hover {
          color: #a498e8;
        }
      }
    }
  }
}

.view-main {
  height: calc(100vh - 60px);
  overflow: auto;

  > div {
    height: 100%;

    ::v-deep .file-list-v2-viewer {
      height: 100%;
    }

    ::v-deep .image-viewer-wrapper {
      overflow: hidden;

      .image-viewer {
        height: calc(100% - 40px);

        .page-viewers {
          height: 100%;
        }
      }
    }
  }
}

.view-header-tabs-wrapper {
  ::v-deep .el-tabs__nav {
    height: 60px;
  }
  ::v-deep .el-tabs__item {
    font-size: 18px;
    padding: 0 30px;
    line-height: 60px;
    height: 60px;
  }
  ::v-deep .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
}
</style>

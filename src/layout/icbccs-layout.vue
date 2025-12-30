<template>
  <div class="icbccs-layout-wrapper">
    <header class="header">
      <div class="header-left">
        <svg-icon icon-class="icbccs-logo" class="logo"></svg-icon>
        <el-menu
          :default-active="activeMenu"
          class="menu-content"
          mode="horizontal"
          background-color="#000"
          text-color="#fff"
          active-text-color="#e0364a"
          @select="handleSelectMenu">
          <el-menu-item index="project">
            <svg-icon icon-class="icbccs-index" class="icon"></svg-icon>
            首页
          </el-menu-item>
          <el-menu-item v-if="$features.isShowUserManager()" index="userManage">
            <svg-icon icon-class="icbccs-user-manage" class="icon"></svg-icon>
            用户管理
          </el-menu-item>
        </el-menu>
      </div>
      <el-dropdown class="user-info" @command="handleCommand">
        <span>
          {{ userInfo.user_data.username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="isShowPassword" command="password">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <div>
      <update-password-dialog
        v-if="isDialogVisible"
        @close-dialog="closeDialog">
      </update-password-dialog>

      <router-view />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import UpdatePasswordDialog from '@/components/update-password-dialog.vue';
import SvgIcon from '../components/svg-icon.vue';
import { EventBus } from '../tools/event-bus';

export default {
  name: 'IcbccsLayout',
  components: {
    UpdatePasswordDialog,
    SvgIcon,
  },
  data() {
    return {
      activeMenu: 'project',
      isDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    isShowPassword() {
      return this.$features.isShowUpdateUserPassword();
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        this.activeMenu = val.name;
      },
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
    handleSelectMenu(key) {
      this.$router.push({ name: key });
    },
    async logout() {
      try {
        EventBus.$emit('logout-sub-systems');
        await this.$nextTick();
        await this.$store.dispatch('UserInfo/logout');
        location.reload();
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
.icbccs-layout-wrapper {
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  .header {
    padding: 0 30px;
    background: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      display: flex;
      align-items: center;
      .logo {
        width: 300px;
      }
      .menu-content {
        height: 59px;
      }
      ::v-deep .el-menu-item {
        display: flex;
        align-items: center;
        font-size: 16px;
        .icon {
          width: 16px;
          margin-right: 8px;
        }
      }
    }
    .user-info {
      cursor: pointer;
      color: #fff;
    }
  }
  ::v-deep .user-manage-container {
    margin: 0 30px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button--primary {
        background: #e0364a;
        border-color: #e0364a;
      }
    }
    .el-pager {
      li {
        &.active,
        &:hover {
          color: #e0364a;
        }
      }
    }
  }
}
</style>

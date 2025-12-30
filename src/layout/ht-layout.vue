<template>
  <div class="ht-layout-wrapper">
    <div v-if="isLogged" class="layout-header">
      <div class="header-left">
        <img
          src="../assets/img/ht-logo.png"
          class="ldap-logo-wrapper"
          @click="clickNavItem('project')" />
        <div
          class="nav-btn"
          :class="isActiveNav('project') ? 'active' : ''"
          @click="clickNavItem('project')">
          <svg-icon icon-class="ht-home" class="nav-icon"></svg-icon>
          首页
        </div>
        <div
          v-if="isShowVisitStatBtn"
          class="nav-btn"
          :class="isActiveNav('serviceStat') ? 'active' : ''"
          @click="clickNavItem('serviceStat')">
          <svg-icon icon-class="ht-statistics" class="nav-icon"></svg-icon>
          通用服务统计
        </div>
      </div>
      <el-dropdown class="user-info" @command="handleClick">
        <span class="el-dropdown-link">
          {{ userInfo.user_data.username || userInfo.user_data.uid }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="user-menu">
          <el-dropdown-item command="editUserPhoneNumber">
            {{ `${userInfo.user_data.phone_number ? '编辑' : '新增'}手机号码` }}
          </el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <router-view />
    <edit-phone-number
      v-if="showEditPhoneNumberDialog"
      @close="closeEditPhoneNumberDialog">
    </edit-phone-number>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import EditPhoneNumber from '../components/ht/edit-phone-number.vue';
import { EventBus } from '../tools/event-bus';

export default {
  name: 'HtLayout',
  components: { EditPhoneNumber },
  data() {
    return {
      showEditPhoneNumberDialog: false,
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo', 'isLogged']),
    isShowVisitStatBtn() {
      return this.userInfo.ext_uname === 'admin';
    },
  },
  created() {},
  methods: {
    isActiveNav(navName) {
      return this.$router.history.current.name === navName;
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
    clickNavItem(routerName) {
      this.$router.push({ name: routerName });
    },
    handleCommand(command) {
      this.$router.push({ name: command });
    },
    handleClick(command) {
      switch (command) {
        case 'editUserPhoneNumber':
          this.showEditPhoneNumberDialog = true;
          break;
        case 'logout':
          this.logout();
          break;
      }
    },
    closeEditPhoneNumberDialog() {
      this.showEditPhoneNumberDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.ht-layout-wrapper {
  width: 100%;
  min-height: 100vh;
  min-width: 1440px;
  position: relative;
  background-size: cover;
  text-align: left;
  background: #fff;
  font-family: 'SourceHanSansCN-Regular', 'Times New Roman';
  background-image: url('../assets/img/ht-project-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  .layout-header {
    background: #005bac;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    .header-left {
      display: flex;
      align-items: center;
    }

    .user-info {
      cursor: pointer;
      font-size: 16px;
      .el-dropdown-link {
        color: #fff;
      }
    }
    ::v-deep .el-dropdown-link {
      padding: 6px 15px;
    }
  }
  .ldap-logo-wrapper {
    margin-left: 15px;
    margin-right: 100px;
    width: 150px;
  }

  .nav-btn {
    min-width: 170px;
    padding: 6px 0;
    text-align: center;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;
    &.active {
      background: #dbdbdb33;
      border-radius: 18px;
    }
    i {
      margin-right: 5px;
      font-size: 20px;
    }
    .nav-icon {
      width: 24px;
      height: 24px;
      margin-right: 10px;
      vertical-align: bottom;
    }
  }
  .ldap-login-footer {
    position: absolute;
    color: #666;
    font-size: 18px;
    left: 44%;
    bottom: 20px;
  }
}
</style>
<style lang="scss">
.ht-dropdown-menu {
  font-family: 'SourceHanSansCN-Regular';
}
.user-menu {
  font-family: 'SourceHanSansCN-Regular';
  .el-dropdown-menu__item {
    text-align: center;
    min-width: 84px;
  }
}
</style>

<template>
  <div class="user-management-wrapper" :class="containerClass">
    <el-tabs class="user-management-tabs">
      <el-tab-pane v-if="isShowUserManagerTab" label="用户管理">
        <user-management></user-management>
      </el-tab-pane>
      <el-tab-pane v-if="isShowRoleManagerTab" label="角色管理">
        <role-management></role-management>
      </el-tab-pane>
    </el-tabs>
    <svg-icon
      v-if="$features.showCloseUserManagementBtn()"
      icon-class="close"
      @click="closeUserManagement">
    </svg-icon>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserManagement from '@/components/user-management.vue';
import RoleManagement from '@/components/role-management.vue';
import SvgIcon from '@/components/svg-icon.vue';
export default {
  name: 'UserManage',
  components: {
    UserManagement,
    RoleManagement,
    SvgIcon,
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['userInfo']),
    containerClass() {
      return this.config.sys;
    },
    isSWHYEnv() {
      return this.$platform.isSWHYEnv();
    },
    isSWHYXyzEnv() {
      return this.isSWHYEnv && /swhy/.test(this.$route.path);
    },
    isShowUserManagerTab() {
      if (this.isSWHYEnv) {
        const isUserManager = this.isRightPermission([
          'user_admin',
          'sponsor_super_admin',
          'bond_super_admin',
        ]);
        return (
          (!this.isSWHYXyzEnv || this.$route.name === 'swhyUserManage') &&
          (this.$features.isSelfSystemAdmin() ? true : isUserManager)
        );
      }
      return true;
    },
    isShowRoleManagerTab() {
      if (this.$features.showRoleManagement()) {
        if (this.isSWHYEnv) {
          const isRoleManager = this.isRightPermission([
            'role_admin',
            'sponsor_super_admin',
            'bond_super_admin',
          ]);
          return (
            (!this.isSWHYXyzEnv || this.$route.name === 'swhyRoleManage') &&
            (this.$features.isSelfSystemAdmin() ? true : isRoleManager)
          );
        } else {
          return !this.$features.isShowSecondaryAdmin();
        }
      }
      return false;
    },
  },
  methods: {
    isRightPermission(keys) {
      return this.userInfo.roles.find((item) => {
        return item.role_data
          ? keys.includes(item.role_data.customer_role_name)
          : false;
      });
    },
    closeUserManagement() {
      this.$router.push('/project');
    },
  },
};
</script>

<style lang="scss" scoped>
.user-management-wrapper {
  position: relative;
  background-color: #fff;
  margin: 0 30px;
  &.cmbchina {
    min-width: 1050px;
  }
  .user-management-tabs {
    padding: 25px 30px;
    box-sizing: border-box;
  }
  .svg-icon {
    position: absolute;
    top: 20px;
    right: 25px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  &.fullgoal {
    background-color: rgba(255, 255, 255, 0.7);
  }
  &.htffund {
    .user-management-tabs {
      ::v-deep .el-tabs__item {
        &.is-active,
        &:hover {
          color: #d38a68;
        }
      }
      ::v-deep .el-tabs__active-bar {
        background: #d38a68;
      }
      ::v-deep .el-button--primary {
        background-color: #d38a68;
        border-color: #d38a68;
      }
      ::v-deep .role-name,
      ::v-deep .user-roles,
      ::v-deep .role-list {
        color: #d38a68;
      }
      ::v-deep .role-list {
        background: #f9f0ec;
      }
    }
  }
  &.cmfchina {
    margin: 0;
    padding: 0 20px;
    .user-management-tabs {
      padding: 0;
      ::v-deep .user-manage-container,
      ::v-deep .role-manage-container {
        display: flex;
        flex-flow: column;
        overflow: hidden;
        height: calc(100vh - 95px);
        .header {
          .el-button {
            font-weight: bold;
            i {
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>

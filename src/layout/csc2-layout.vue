<template>
  <div class="csc2-layout-wrapper">
    <header>
      <router-link :to="'/'">
        <img src="../assets/img/csc-logo.png" />
      </router-link>
      <div class="user-info-wrapper">
        <template v-if="$features.isEnableSysRequire()">
          <el-tooltip
            v-if="$features.isShowUserManager()"
            effect="light"
            :disabled="approvalCount === 0"
            content="您有待审批的银行流水系统使用申请"
            placement="bottom">
            <el-button type="text" @click="routerToView('/approvalManage')">
              银行流水系统使用申请审批({{ approvalCount }})
            </el-button>
          </el-tooltip>
          <el-button v-else type="text" @click="openApprovalDialog">
            银行流水系统使用申请
          </el-button>
        </template>
        <el-button
          v-if="$features.isShowUserManager()"
          type="text"
          @click="routerToView('/userManage')">
          用户管理
        </el-button>
        <div v-popover:userInfo class="user-info">
          <span>{{ userInfo.user_data.username }}</span>
          <i class="el-icon-arrow-down"></i>
          <el-popover
            ref="userInfo"
            placement="bottom"
            popper-class="csc2-user-popover"
            trigger="click">
            <button class="user-logout" @click="logout">退出登录</button>
          </el-popover>
          <iframe
            v-if="isLogoutCurrentSys"
            ref="cscLogout"
            :src="cscLogout()"
            class="csc-logout-iframe"
            @onload="currentSysLogouted">
          </iframe>
        </div>
      </div>
    </header>
    <router-view />

    <approval-system-dialog
      v-if="isApprovalDialogVisible"
      :username="username"
      @click-confirm="submitApprovalSystem"
      @close-dialog="closeApprovalDialog">
    </approval-system-dialog>
  </div>
</template>
<script>
import { cscLogout } from '../api/login';
import { createApprovalSystem } from '../api/sys-info';
import ApprovalSystemDialog from '../components/approval-system-dialog.vue';
import { EventBus } from '../tools/event-bus';
import { mapGetters } from 'vuex';

export default {
  name: 'Csc2Layout',
  components: {
    ApprovalSystemDialog,
  },
  data() {
    return {
      isApprovalDialogVisible: false,
      isLogoutCurrentSys: false,
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    approvalCount() {
      return this.userInfo.need_verify_count || 0;
    },
    username() {
      const userData = this.userInfo.user_data;
      return userData.username || userData.ext_uname || '';
    },
  },
  created() {
    EventBus.$on('open-system-approval-dialog', this.openApprovalDialog);
  },
  beforeDestroy() {
    EventBus.$off('open-system-approval-dialog', this.openApprovalDialog);
  },
  methods: {
    cscLogout,
    async logout() {
      try {
        EventBus.$emit('logout-sub-systems');
        await this.$nextTick();
        this.isLogoutCurrentSys = true;
        await this.$nextTick();
        this.$refs.cscLogout.onload = this.currentSysLogouted;
      } catch (error) {
        this.$notify.error('退出登录失败');
      }
    },
    currentSysLogouted() {
      location.reload();
    },
    openApprovalDialog() {
      this.isApprovalDialogVisible = true;
    },
    closeApprovalDialog() {
      this.isApprovalDialogVisible = false;
    },
    async submitApprovalSystem(data) {
      const params = {
        sys: 'grater',
        start_utc: data.date[0] / 1000,
        end_utc: data.date[1] / 1000,
        project_name: data.project_name,
        reason: data.reason,
      };
      try {
        await createApprovalSystem(params);
        this.closeApprovalDialog();
        this.$notify.success('提交成功');
        this.$store.dispatch('UserInfo/getLoggStatus');
      } catch (e) {
        this.$notify.error(e.message);
      }
    },
    routerToView(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss">
.csc2-user-popover {
  min-width: 100px !important;
  padding: 0 !important;
  .user-logout {
    border: none;
    width: 100%;
    height: 34px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
.csc2-layout-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-size: cover;
  text-align: left;
  overflow: auto;
  min-width: 1000px;
  ::v-deep .user-management-wrapper {
    height: calc(100% - 83px);
    padding: 0 70px;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    width: 100%;
    padding: 0 100px;
    box-sizing: border-box;
    img {
      width: 200px;
    }
    .user-info-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        margin-right: 20px;
        font-size: 15px;
        &:hover {
          opacity: 0.7;
        }
      }
      .el-button--text {
        color: #606266;
      }
      a {
        margin-right: 30px;
        font-size: 16px;
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
      .user-info {
        cursor: pointer;
        span {
          color: #000;
        }
        i {
          color: #000;
          margin-left: 10px;
        }
      }
      .csc-logout-iframe {
        display: none;
      }
    }
  }
}
</style>

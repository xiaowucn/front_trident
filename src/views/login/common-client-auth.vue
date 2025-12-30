<template>
  <section v-if="isXyzqEnv" class="xyzq-auth-wrapper">
    <header>
      <img src="../../assets/img/xyzq-logo.png" alt="请刷新图片" />
    </header>
    <div class="login-wrapper">
      <div class="login-title">统一登录平台</div>
      <login-form @reset-password="openPasswordDialog" />
    </div>

    <update-password-dialog
      v-if="isDialogVisible"
      :is-reset-password="true"
      @close-dialog="closeDialog"
      @reset-user-password="handleResetUserPassword">
    </update-password-dialog>
  </section>

  <custom-login-container v-else-if="isShowCustomLoginContainer" />

  <div
    v-else-if="isShowViewTitle"
    class="common-client-auth-wrapper"
    :class="containerClass">
    <img
      v-if="isEBSCNEnv"
      src="@/assets/img/ebscn-logo.png"
      alt="logo"
      class="logo" />

    <div
      v-if="isShowViewTitle"
      class="login-title"
      :class="{ 'kysec-title': isKysecEnv }">
      {{ clientTitle }}
    </div>
    <login-form />
  </div>

  <div v-else class="other-auth-wrapper" :class="containerClass">
    <div class="ldap-img">
      <img src="../../assets/img/ht-illustration.png" alt="illustration" />
    </div>
    <div class="login-form-wrapper">
      <div
        class="login-title"
        :class="{ 'space-title': !$features.isShowCaptcha() }">
        {{ clientTitle }}
      </div>
      <login-form />
    </div>
    <div v-if="isHtNlEnv" class="ldap-login-footer">
      &copy; 海通AI平台提供服务
    </div>
  </div>
</template>
<script>
import LoginForm from '../../components/login/login-form.vue';
import CustomLoginContainer from '../../components/login/custom-login-container.vue';
import UpdatePasswordDialog from '../../components/update-password-dialog.vue';
import { resetUserPassword } from '../../api/login';

export default {
  name: 'CommonClientAuth',
  components: { LoginForm, UpdatePasswordDialog, CustomLoginContainer },
  data() {
    return {
      isDialogVisible: false,
      userData: null,
    };
  },
  computed: {
    isShowViewTitle() {
      return (
        this.$platform.isCiccEnv() ||
        this.$platform.isCsc2Env() ||
        this.$platform.isGuosenEnv() ||
        this.$platform.isKysecEnv() ||
        this.isEBSCNEnv ||
        this.$platform.isCscEnv()
      );
    },
    isShowCustomLoginContainer() {
      return this.isCmsEnv || this.isCuamEnv;
    },
    clientTitle() {
      return process.env.VUE_APP_LOGIN_TITLE || '平台登录系统';
    },
    isHtNlEnv() {
      return this.$platform.isHtNlEnv();
    },
    isEBSCNEnv() {
      return this.$platform.isEBSCNEnv();
    },
    isKysecEnv() {
      return this.$platform.isKysecEnv();
    },
    isXyzqEnv() {
      return this.$platform.isXyzqEnv();
    },
    isCmsEnv() {
      return this.$platform.isCmsEnv();
    },
    isCuamEnv() {
      return this.$platform.isCuamEnv();
    },
    containerClass() {
      if (this.$platform.isCiccEnv()) {
        return 'cicc';
      } else if (this.isEBSCNEnv) {
        return 'ebscn';
      } else if (this.isHtNlEnv) {
        return 'htnl';
      } else {
        return '';
      }
    },
  },
  methods: {
    openPasswordDialog(data) {
      this.userData = data;
      this.isDialogVisible = true;
    },
    closeDialog() {
      this.userData = null;
      this.isDialogVisible = false;
    },
    async handleResetUserPassword(password) {
      try {
        const data = {
          uid: this.userData.uid,
          password,
          confirm_password: this.userData.password,
        };
        await resetUserPassword(data);
        this.$notify.success({
          title: '成功',
          message: '重置密码成功',
        });
        this.closeDialog();
      } catch (e) {
        this.$notify.error({
          title: '失败',
          message: e.message || '重置密码失败',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-title {
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  color: #fff;
  margin: 20px 0 20px 26px;
  &.space-title {
    margin: 30px 0 40px 26px;
    letter-spacing: 3px;
  }
}

.htnl,
.ebscn {
  ::v-deep .oa-login-item {
    display: block;
    margin-bottom: 0;
  }
}

.common-client-auth-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -250px 0 0 -200px;
  width: 400px;
  height: 300px;

  .kysec-title {
    margin: 70px 0 10px 0;
    color: #ffffff;
    text-align: center;
    width: 100%;
    font-size: 26px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: 10px;
  }

  &.cicc {
    ::v-deep .is-checked {
      .el-checkbox__inner {
        background-color: #640000;
        border-color: #640000;
      }
    }
    ::v-deep .login-btn {
      .el-button {
        font-size: 18px;
        background-color: #640000;
        border: 1px solid #430c0c;
      }
    }
  }
}

.other-auth-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  width: 800px;
  height: 340px;
  margin: auto;
  padding: 20px 50px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  .ldap-img {
    img {
      width: 400px;
    }
  }
  .ldap-login-footer {
    position: absolute;
    bottom: -34px;
    left: 42%;
    color: white;
    font-size: 16px;
  }
  .login-form-wrapper {
    flex: 1;
    margin-left: 36px;
  }
}

.xyzq-auth-wrapper {
  header {
    height: 60px;
    padding: 0 100px;
    background-color: #ffffff;
    text-align: left;
    img {
      width: 145px;
      margin-top: 15px;
    }
  }
  height: 100%;

  .login-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -250px 0 0 -200px;
    width: 400px;
    height: 300px;
  }
}

.ebscn {
  padding: 20px 40px;
  height: auto;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  .logo {
    position: fixed;
    top: 30px;
    left: 30px;
    width: 300px;
  }
  ::v-deep.login-btn {
    .el-button {
      background-color: #885eff;
      border-color: #885eff;
    }
  }
}
</style>

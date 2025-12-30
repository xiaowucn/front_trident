<template>
  <div class="other-auth-wrapper">
    <div class="logo-wrapper">
      <img
        class="logo"
        src="../../assets/img/piccamc-logo.svg"
        alt="illustration" />
      <el-divider direction="vertical"></el-divider>
      <span class="title">智能文档审核系统</span>
    </div>
    <div class="login-form-block">
      <div class="login-title">用户登录</div>
      <login-form label-position="top" />
    </div>
  </div>
</template>
<script>
import LoginForm from '../../components/login/login-form.vue';
import { resetUserPassword } from '../../api/login';

export default {
  name: 'CommonClientAuth',
  components: { LoginForm },
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
  font-size: 26px;
  font-weight: bolder;
  color: #fff;
}

.other-auth-wrapper {
  display: flex;
  margin: auto;

  border-radius: 8px;
  align-items: center;
  justify-content: center;
  height: 100%;

  .logo-wrapper {
    flex-shrink: 0;
    align-items: center;
    justify-content: space-around;
    display: flex;
    margin-right: 100px;

    .el-divider {
      background-color: rgba(255, 255, 255, 0.6);
      height: 36px;
      margin: 0 50px;
    }
    .title {
      font-weight: 700;
      font-size: 30px;
      color: white;
    }
    .log {
      width: 468px;
      height: 30px;
    }
  }
  .login-form-block {
    flex-shrink: 0;
    margin-left: 36px;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    width: 480px;
    height: 528px;
    border-radius: 20px;
    align-self: center;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(151, 151, 151, 1);

    .login-form-wrapper {
      width: 307px;
      margin: 40px auto;

      ::v-deep .el-form-item {
        margin-bottom: 10px;
        .el-form-item__label {
          padding: 0;
        }
      }
      ::v-deep .login-btn {
        margin: 50px 0 0;
        .el-button {
          background: linear-gradient(0deg, #1665d8 2.22%, #1f6fe5 98.44%);
          border: 1px solid rgba(20, 97, 210, 1);
        }
      }
    }
  }
}
</style>

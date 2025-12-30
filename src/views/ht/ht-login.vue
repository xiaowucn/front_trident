<template>
  <div class="ht-login-container">
    <img class="logo" src="../../assets/img/ht-logo-simple.png" alt="ht-logo" />
    <div class="login-panel">
      <h1>金融文本分析系统</h1>
      <div class="login-panel-content">
        <div class="system-description">
          <div
            v-for="(desc, index) in htSystemDescription"
            :key="index"
            class="system-description-item">
            <img class="icon" :src="getHtDescIcon(desc.icon)" />
            <div>
              <p class="title">{{ desc.title }}</p>
              <p class="description">{{ desc.description }}</p>
            </div>
          </div>
        </div>
        <el-form
          ref="ldapForm"
          :model="ldapForm"
          :rules="ldapRules"
          class="login-form">
          <el-form-item prop="uid">
            <el-input
              v-model.trim="ldapForm.uid"
              clearable
              prefix-icon="el-icon-user"
              placeholder="账户" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="ldapForm.password"
              type="password"
              clearable
              prefix-icon="el-icon-lock"
              placeholder="密码"
              @keyup.enter.native="login" />
          </el-form-item>
          <el-form-item
            v-if="isShowCaptcha"
            prop="captcha"
            class="captcha-item">
            <el-input
              v-model.trim="ldapForm.captcha"
              class="captcha-input"
              type="text"
              clearable
              prefix-icon="el-icon-key"
              placeholder="验证码" />
            <img
              :src="`data:image/jpeg;base64,${captcha}`"
              alt="验证码"
              title="点击刷新验证码"
              class="captcha-img"
              @click="getCaptcha()" />
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" size="medium" @click="login">
              登录
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { htSystemDescription } from '../../tools/ht-constants';
import { getRedirectURL } from '../../tools/index';

// Preload all ht description icons
const htDescIcons = import.meta.glob('../../assets/img/ht-desc-*.svg', {
  eager: true,
  import: 'default',
});

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      ldapForm: {
        uid: '',
        password: '',
        captcha: '',
        mobile: '',
        verifyCode: '',
      },
      ldapRules: {
        uid: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ],
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ],
      },
      htSystemDescription,
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['csrfToken', 'captcha']),
    ...mapGetters('SysInfo', ['config']),
    isUseHtNewOALogin() {
      return this.$platform.isHtNewOAEnv();
    },
    isShowCaptcha() {
      return !this.isUseHtNewOALogin && this.$features.isShowCaptcha();
    },
  },
  async created() {
    await this.getCaptcha();
  },
  methods: {
    getHtDescIcon(iconName) {
      const path = `../../assets/img/${iconName}.svg`;
      return htDescIcons[path] || '';
    },
    async getCaptcha() {
      try {
        await this.$store.dispatch('UserInfo/getCaptcha');
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    async getCSRFtoken() {
      try {
        await this.$store.dispatch('UserInfo/getCSRFtoken');
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    async login() {
      try {
        await this.$refs['ldapForm'].validate();
        await this.getCSRFtoken();
        if (this.isUseHtNewOALogin) {
          const params = {
            username: this.ldapForm.uid,
            password: this.ldapForm.password,
          };
          const resp = await this.$store.dispatch(
            'UserInfo/htLoginByNewOA',
            params,
          );
          if (resp.data.redirect_url) {
            location.href = getRedirectURL(
              this.config.redirect_subpath,
              resp.data.redirect_url,
            );
            return;
          }
        } else {
          await this.$store.dispatch('UserInfo/login', this.ldapForm);
        }
        await this.$store.dispatch('UserInfo/getLoggStatus');
        this.$router.push('project');
      } catch (error) {
        if (error) {
          this.$notify.error({
            title: '提示',
            message: error.message,
          });
          if (this.$features.isShowCaptcha()) {
            this.getCaptcha();
          }
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.ht-login-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url('../../assets/img/ht-login-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.logo {
  position: fixed;
  top: 30px;
  left: 30px;
  width: 200px;
}

.login-panel {
  width: 800px;
  padding: 70px 70px 30px 70px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);

  h1 {
    margin: 0;
    font-size: 32px;
    color: #333333;
    text-align: center;
  }
}
.mobile-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.verify-code-input {
  width: 65%;
}
.verify-dialog {
  .el-input {
    width: 50%;
  }
  .get-verifycode-btn {
    min-width: 180px;
    margin-left: 10px;
  }
  .countdown-tips {
    margin: 0;
    color: #ff1e11;
  }
}
.dialog-footer {
  text-align: center;
}

.login-panel-content {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-top: 40px;
}

.system-description {
  display: flex;
  flex-flow: column;
  flex: 1;
  margin-right: 40px;
  padding-right: 30px;
  border-right: 1px solid rgba(#45558f, 0.2);

  .system-description-item {
    display: flex;
    flex-flow: row;
    align-items: center;
    row-gap: 10px;
    margin-bottom: 20px;

    .icon {
      width: 40px;
    }

    .title {
      margin: 10px;
      font-size: 16px;
      color: #274c81;
    }

    .description {
      margin: 10px;
      font-size: 12px;
      color: #2a2a2a;
    }
  }
}

.login-form {
  flex: 1;

  .el-input {
    ::v-deep .el-input__inner {
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      padding-left: 34px;
    }
    ::v-deep .el-input__prefix {
      color: #2c7cd3;
      font-size: 16px;
    }
  }
  .captcha-item {
    ::v-deep .el-form-item__content {
      display: flex;
    }
    .captcha-input {
      margin-right: 12px;
    }
    .captcha-img {
      width: 100px;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
    }
  }
  .login-btn {
    ::v-deep .el-button {
      width: 100%;
      background: #274c81;
    }
  }
}
</style>

<template>
  <el-form
    ref="ldapForm"
    :model="ldapForm"
    :rules="ldapRules"
    label-width="70px"
    :label-position="labelPosition"
    class="login-form-wrapper"
    :class="{ 'custom-oa': isShowCaptcha && isShowOaChecked }">
    <el-form-item :label="`${loginAccountLabel}:`" prop="uid">
      <el-input
        v-model.trim="ldapForm.uid"
        clearable
        :placeholder="`请填写${loginAccountLabel}`"
        @blur="changeLdapUsername"/>
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input
        v-model="ldapForm.password"
        type="password"
        clearable
        placeholder="请填写密码"
        @keyup.enter.native="login"/>
    </el-form-item>
    <el-form-item
      v-if="isShowCaptcha"
      label="验证码:"
      prop="captcha"
      class="captcha-item">
      <el-input
        v-model.trim="ldapForm.captcha"
        class="captcha-input"
        type="text"
        clearable
        prefix-icon="el-icon-key"
        placeholder="请填写验证码"
        @keyup.enter.native="login"/>
      <img
        :src="`data:image/jpeg;base64,${captcha}`"
        alt="验证码"
        title="点击刷新验证码"
        class="captcha-img"
        @click="getCaptcha()"/>
    </el-form-item>
    <el-form-item v-if="isShowOaChecked" class="oa-login-item">
      <el-checkbox v-model="isLdapLogin">{{ oaLoginText }}</el-checkbox>
    </el-form-item>
    <div class="login-btn">
      <el-button
        type="primary"
        size="medium"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        @click="login">
        登录
      </el-button>
    </div>
    <div v-if="$platform.isRSMEnv()" class="business-redirect">
      <a href="https://bankcheck.rsmchina.com.cn" target="_blank">
        跳转至业务登录页面
      </a>
    </div>
  </el-form>
</template>
<script>
import { mapGetters } from 'vuex';
import { getRedirectURL } from '../../tools/index';
import { getSubSystemURL } from '@/tools/customer-redirect-url';
import { loginEBSCNSubSystem } from '@/api/ebscn';

export default {
  name: 'LoginForm',
  props: {
    labelPosition: {
      type: String,
      default: 'left',
    },
  },
  data() {
    return {
      isSubmitting: false,
      isLdapLogin: false,
      ldapForm: {
        uid: '',
        password: '',
        captcha: '',
      },
      ldapRules: {
        uid: [{ validator: this.validateRequireUserName, trigger: 'blur' }],
        password: [
          { validator: this.validateRequirePassword, trigger: 'blur' },
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['csrfToken', 'captcha']),
    isShowCaptcha() {
      return this.$features.isShowCaptcha();
    },
    isShowOaChecked() {
      return (
        this.isCgsEnv || this.isHtNlEnv || this.isEBSCNEnv || this.isPICCAMCEnv
      );
    },
    oaLoginText() {
      if (this.isEBSCNEnv) {
        return '通过协同账号登录';
      } else {
        return '通过OA账号登录';
      }
    },
    isXyzqEnv() {
      return this.$platform.isXyzqEnv();
    },
    isCgsEnv() {
      return this.$platform.isCgsEnv();
    },
    isHtNlEnv() {
      return this.$platform.isHtNlEnv();
    },
    isEBSCNEnv() {
      return this.$platform.isEBSCNEnv();
    },
    isPICCAMCEnv() {
      return this.$platform.isPICCAMCEnv();
    },
    loginAccountLabel() {
      if (this.$platform.isCiticsTgEnv() || this.$platform.isCMBCHINAEnv()) {
        return '工号';
      }
      return '用户名';
    },
  },
  async created() {
    await this.getCSRFtoken();
    await this.getCaptcha();
    if (this.isShowOaChecked) {
      this.isLdapLogin = true;
    }
  },
  methods: {
    validateRequireUserName(rule, value, callback) {
      if (value === '') {
        callback(new Error(`${this.loginAccountLabel}不能为空`));
      } else {
        callback();
      }
    },
    validateRequirePassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('密码不能为空'));
      } else {
        callback();
      }
    },
    async getCaptcha() {
      if (!this.isShowCaptcha) {
        return;
      }
      try {
        await this.$store.dispatch('UserInfo/getCaptcha');
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    changeLdapUsername() {
      if (this.$platform.isKysecEnv()) {
        this.isLdapLogin = this.ldapForm.uid !== 'admin';
        return;
      }
      if (this.isLdapLogin && !this.isEBSCNEnv) {
        let reg = /^[0-9]{1,5}$/;
        let userName = this.ldapForm.uid;
        if (reg.test(userName)) {
          this.ldapForm.uid = userName.padStart(6, '0');
        }
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
        if (this.isSubmitting) {
          return;
        }
        this.isSubmitting = true;
        await this.$refs['ldapForm'].validate();

        const params = { ...this.ldapForm };
        let dispatchPath = 'UserInfo/login';

        if (this.$platform.isIcbccsEnv()) {
          params.url = this.config.user_login_api;
        }

        if (this.$platform.isCCZQEnv()) {
          sessionStorage.setItem('cczq-session-security', true);
        }

        if (this.isLdapLogin) {
          if (this.isEBSCNEnv) {
            params.url = '/ebscn/sso-login';
          } else if (this.isPICCAMCEnv) {
            params.url = 'ldap/ad-login';
          } else {
            params.csrfToken = this.csrfToken;
            dispatchPath = 'UserInfo/ldapLogin';
          }
        }

        const resp = await this.$store.dispatch(dispatchPath, params);

        if (resp.data.redirect_url) {
          window.location.href = getRedirectURL(
            this.config.redirect_subpath,
            resp.data.redirect_url,
          );
          return;
        }

        const userData = await this.$store.dispatch('UserInfo/getLoggStatus');

        const subSystemURL = getSubSystemURL(this.config, userData);
        if (subSystemURL) {
          window.location.href = subSystemURL;
          return;
        }

        if (this.$platform.isJHZQEnv() && this.$features.isSelfSystemAdmin()) {
          this.$router.push('log');
        } else if (this.isEBSCNEnv) {
          await loginEBSCNSubSystem();
          this.$router.push('review');
        } else if (this.$features.isShowSecondaryAdmin()) {
          this.$router.push('/userManage');
        } else {
          this.$router.push({ name: 'project', query: this.$route.query });
        }
      } catch (error) {
        this.isSubmitting = false;
        this.getCaptcha();
        if (error) {
          if (this.isXyzqEnv && error.status === 418) {
            this.$emit('reset-password', this.ldapForm);
            return;
          }
          let message = error.message;
          if (message === 'Invalid csrf_token') {
            message = '请刷新页面后重试';
          } else if (message === 'bad username or password') {
            message = `${this.loginAccountLabel}或密码错误`;
          }
          this.$notify.error({ message });
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.login-form-wrapper {
  .custom-oa {
    .captcha-item {
      margin-bottom: 12px;
    }
    .oa-login-item {
      margin: 0;
    }
    .login-btn {
      margin-top: 0;
    }
  }
  ::v-deep .el-form-item__label {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
  .captcha-item {
    ::v-deep .el-form-item__label::before {
      display: none;
    }
    ::v-deep .el-form-item__content {
      display: flex;
    }
    .captcha-input {
      width: 156px;
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
  .oa-login-item {
    display: flex;
    justify-content: flex-end;
    ::v-deep .el-checkbox__label {
      font-size: 16px;
      color: #fff;
    }
  }
  .login-btn {
    height: 40px;
    margin: 15px auto 15px 70px;
    ::v-deep .el-button {
      width: 100%;
      height: 100%;
      letter-spacing: 3px;
    }
  }
  .business-redirect {
    margin-left: 70px;
    text-align: center;
    a {
      color: #fff;
      font-size: 26px;
      font-weight: bold;
    }
  }
}
</style>

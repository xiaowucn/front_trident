<template>
  <div class="login-container">
    <div class="content-container">
      <div class="logo-container">
        <img src="../../assets/img/nafmii-log.png" alt="Logo" class="logo" />
        <span class="name">中国银行间市场交易商协会</span>
        <span class="name-en">
          National Association of Financial Market Institutional Investors
        </span>
      </div>
      <el-card class="form-container" shadow="always">
        <span slot="header" class="title">欢迎登录</span>

        <el-tabs
          v-model="loginType"
          stretch
          type="card"
          class="login-tabs"
          @tab-click="switchLoginType">
          <el-tab-pane label="个人登录" name="personal"></el-tab-pane>
          <el-tab-pane label="机构登录" name="institutional"></el-tab-pane>
        </el-tabs>

        <div class="login-form">
          <el-form ref="loginForm" :model="form" :rules="rules">
            <template v-if="loginType === 'institutional'">
              <el-form-item prop="institutionId">
                <el-input
                  v-model="form.institutionId"
                  placeholder="请输入机构编号"
                  class="form-item">
                  <i
                    slot="prefix"
                    class="el-icon-office-building el-input__icon">
                  </i>
                </el-input>
              </el-form-item>
              <!-- 添加 el-form-item 并指定 prop -->
              <el-form-item prop="businessAccount">
                <el-input
                  v-model="form.businessAccount"
                  placeholder="请输入业务账号"
                  class="form-item">
                  <i slot="prefix" class="el-icon-user el-input__icon"> </i>
                </el-input>
              </el-form-item>
            </template>
            <el-form-item v-if="loginType === 'personal'" prop="account">
              <el-input
                ref="accountInput"
                v-model="form.account"
                placeholder="请输入登录账号/注册手机号"
                class="form-item">
                <i slot="prefix" class="el-icon-user el-input__icon"> </i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                class="form-item"
                show-password>
                <i slot="prefix" class="el-icon-lock el-input__icon"> </i>
              </el-input>
            </el-form-item>

            <!-- 验证码区域 -->
            <!-- 添加 el-form-item 并指定 prop -->
            <el-form-item prop="captcha">
              <div class="captcha-wrapper form-item">
                <el-input
                  ref="captchaInput"
                  v-model="form.captcha"
                  placeholder="请输入验证码"
                  class="captcha-input"
                  @keyup.enter.native="handleLogin"/>
                <div class="captcha-code">
                  <img
                    :src="`data:image/jpeg;base64,${captcha}`"
                    alt="验证码"
                    class="captcha-img"/>
                </div>
                <el-button type="text" class="refresh-btn" @click="getCaptcha">
                  换一张
                </el-button>
              </div>
            </el-form-item>

            <el-button
              type="primary"
              size="mini"
              class="login-btn"
              :loading="isSubmitting"
              @click="handleLogin">
              登录
            </el-button>
          </el-form>
        </div>

        <div class="footer-links">
          <a :href="config.customer_forget_password_url" target="_blank">
            忘记密码
          </a>
          <a :href="config.customer_register_url" target="_blank">注册</a>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSubSystemURL } from '@/tools/customer-redirect-url';
export default {
  data() {
    return {
      loginType: 'personal',
      // 将表单数据放在 form 对象中
      form: {
        account: '',
        institutionId: '',
        businessAccount: '',
        password: '',
        captcha: '',
      },
      currentCaptcha: '',
      isSubmitting: false,
      // 添加表单验证规则
      rules: {
        account: [
          {
            required: true,
            message: '请输入登录账号/注册手机号',
            trigger: 'blur',
          },
        ],
        institutionId: [
          { required: true, message: '请输入机构编号', trigger: 'blur' },
        ],
        businessAccount: [
          { required: true, message: '请输入业务账号', trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
      accountInput: null,
      captchaInput: null,
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['csrfToken', 'captcha']),
    params() {
      if (this.loginType === 'personal') {
        return {
          uid: this.form.account,
          password: this.form.password,
          captcha: this.form.captcha,
          url: this.config.user_login_api,
        };
      }
      return {
        org_code: this.form.institutionId,
        uid: this.form.businessAccount,
        password: this.form.password,
        captcha: this.form.captcha,
        url: '/organization/login',
      };
    },
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    switchLoginType() {
      // Element Tabs自带切换逻辑
      this.clearForm();
    },
    clearForm() {
      this.form.account = '';
      this.form.institutionId = '';
      this.form.businessAccount = '';
      this.form.password = '';
      this.form.captcha = '';
      // 重置表单验证状态
      this.$refs.loginForm.resetFields();
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
    async handleLogin() {
      const valid = await this.$refs.loginForm.validate();
      if (valid) {
        try {
          this.isSubmitting = true;
          await this.$store.dispatch('UserInfo/login', this.params);
          const userData = await this.$store.dispatch('UserInfo/getLoggStatus');
          const permissions = userData.roles[0].permission;
          const scriberPerm = permissions['scriber'];
          const allowAccessPerm = ['manage_all', 'manage_task'];
          if (
            allowAccessPerm.some(perm => scriberPerm.includes(perm)) ||
            this.$features.isSelfSystemAdmin()
          ) {
            const subSystemURL = getSubSystemURL(this.config, userData);
            if (subSystemURL) {
              window.location.href = subSystemURL;
            } else {
              this.$router.push({ name: 'project' });
            }
          } else {
            this.$notify.error({
              message: '无权限访问',
            });
          }
        } catch (error) {
          this.$notify.error({
            message: error.message,
          });
          if (error.message.includes('验证码')) {
            this.form.captcha = '';
            this.$refs.captchaInput.focus();
          } else if (error.message.includes('用户名或密码错误')) {
            this.form.captcha = '';
            this.form.password = '';
            this.form.account = '';
            this.$refs.accountInput.focus();
          }
          this.getCaptcha();
          this.$refs.loginForm.clearValidate();
        } finally {
          this.isSubmitting = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  margin: auto;
  min-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #e0eafa;
  background-image: url('../../assets/img/nafmii-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .content-container {
    display: flex;
    align-items: center;
    .logo-container {
      background-image: url('../../assets/img/nafmii-image.png');
      width: 549px;
      height: 463px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 549px;
        height: 463px;
        background-color: rgba(30, 56, 138, 0.7);
        font-size: 14px;
      }
      .logo,
      .name,
      .name-en {
        z-index: 1;
        color: rgba(230, 200, 132, 1);
      }
      .name {
        font-weight: 500;
        font-size: 34px;
      }
    }
    .form-container {
      background-color: #fff;
      height: 506px;
      width: 408px;
      ::v-deep .el-card__header {
        padding: 40px 30px 0 30px;
        border-bottom: none;
      }
      .title {
        font-size: 28px;
        color: #255aa6;
        font-weight: 500;
      }
    }
  }

  .title {
    text-align: left;
    color: #303133;
    margin-bottom: 30px;
  }

  ::v-deep .el-tabs__item {
    font-size: 16px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #606266;
    &.is-active {
      background-color: #255aa6;
      color: #fff;
    }
  }

  .login-form {
    margin-top: 15px;
    ::v-deep .el-form-item {
      margin-bottom: 12px;
      .el-form-item__error {
        padding-top: 0;
      }
    }

    .form-item {
      ::v-deep .el-input__inner {
        height: 32px;
        font-size: 13px;
      }
    }

    .captcha-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;

      .captcha-input {
        flex: 4;
      }

      .captcha-code {
        flex: 1;
        height: 32px;
      }

      .refresh-btn {
        flex: 1;
        padding: 0;
        justify-content: flex-end;
        text-align: end;
      }
    }

    .login-btn {
      width: 100%;
      margin-top: 25px;
      height: 32px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .footer-links {
    margin: 25px 0;
    text-align: center;
    display: flex;
    justify-content: space-between;

    a {
      margin: 0;
      padding: 5px 0;
      font-size: 14px;
      font-weight: 400;
      color: #255aa6;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .copyright {
    position: fixed;
    bottom: 30px;
    font-size: 12px;
    color: #909399;
    line-height: 1.6;
    text-align: center;
    margin-top: 30px;

    p:first-child {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
}
</style>

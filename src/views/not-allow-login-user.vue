<template>
  <div class="nesc-logout-container">
    <div class="content-box">
      <img src="../assets/img/stop-using.svg" alt="" class="img-content" />
      <p class="text-content">您的用户无登录系统权限</p>
      <span class="button-content" @click="onHandleBackToLogin">返回登录</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getRedirectSubpath } from '../tools/index';

export default {
  name: 'NotAllowLoginUser',
  computed: {
    ...mapGetters('SysInfo', ['config']),
  },
  created() {
    setTimeout(() => {
      this.onHandleBackToLogin();
    }, 5000);
  },
  methods: {
    onHandleBackToLogin() {
      const redirectSubpath = getRedirectSubpath(this.config.redirect_subpath);
      window.location.href = `${window.location.origin}${redirectSubpath}api/v1/nesc/jwt-login`;
    },
  },
};
</script>
<style scoped lang="scss">
.nesc-logout-container {
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;
  background-image: url('../assets/img/nesc-logout-bg.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-box {
    width: 470px;
    height: 326px;
    background: #ffffff;
    border: 1px solid #eff1f6;
    box-shadow: 0px 4px 14px 0px rgba(200, 211, 234, 0.3);
    border-radius: 6px;
    .img-content {
      width: 174.4px;
      height: 115.31px;
      margin: 74px 148px 28px 148px;
    }
    .text-content {
      height: 24px;
      font-size: 16px;
      color: #909399;
      text-align: center;
      line-height: 24px;
      font-weight: 400;
      margin: 0;
    }
    .button-content {
      height: 22px;
      font-size: 16px;
      color: #2d6eec;
      display: inline-block;
      margin: 10px 203px 0px 203px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="logout-wrapper" :class="wrapperClass">
    <div class="logout-hit">
      <template v-if="isXyzqEnv">
        <svg-icon icon-class="ht-ai"></svg-icon>
        <div class="content">
          <p>您已退出系统</p>
          <p>感谢您的支持，请关闭本页面</p>
        </div>
      </template>
      <div v-else>感谢您使用本系统，请关闭此页面退出</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CommonLogout',
  computed: {
    ...mapGetters('SysInfo', ['config']),
    isXyzqEnv() {
      return this.$platform.isXyzqEnv();
    },
    wrapperClass() {
      return this.config.sys;
    },
  },
};
</script>

<style lang="scss" scoped>
.logout-wrapper {
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  &.citics,
  &.citics-tg {
    background-image: url('../assets/img/citic-login-bg.png');
  }
  &.xyzq {
    background-image: url('../assets/img/xyzq-bg.png');
  }
  .logout-hit {
    display: flex;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 22px;
    color: #fff;
    transform: translate(-50%, -50%);
    .content {
      margin-left: 35px;
      font-size: 22px;
      color: #fff;
      letter-spacing: 0;
      line-height: 34px;
      text-align: left;
    }
  }
}
</style>

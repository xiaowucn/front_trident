<template>
  <div class="login-layout" :class="containerClass">
    <template v-if="isShowLogo">
      <header v-if="isCuamEnv">
        <img class="client-logo" :src="logoUrl" alt="logo" />
      </header>
      <img v-else class="client-logo" :src="logoUrl" alt="logo" />
    </template>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

// Import logo images
import cgsLogo from '../assets/img/cgs-logo.png';
import dxzqLogo from '../assets/img/dxzq/logo.png';
import kysecLogo from '../assets/img/kysec-logo.png';
import cuamLogo from '../assets/img/htffund/cuam-logo.png';

export default {
  name: 'LoginLayout',
  computed: {
    ...mapGetters('SysInfo', ['config']),
    isShowLogo() {
      if (process.env.VUE_APP_FAVICON === 'pai-favicon.ico') {
        return false;
      }
      return (
        this.isCgsEnv || this.isDxzqEnv || this.isKysecEnv || this.isCuamEnv
      );
    },
    isDxzqEnv() {
      return this.$platform.isDxzqEnv();
    },
    isCgsEnv() {
      return this.$platform.isCgsEnv();
    },
    isKysecEnv() {
      return this.$platform.isKysecEnv();
    },
    isCuamEnv() {
      return this.$platform.isCuamEnv();
    },
    logoUrl() {
      if (this.isCgsEnv) {
        return cgsLogo;
      } else if (this.isDxzqEnv) {
        return dxzqLogo;
      } else if (this.isKysecEnv) {
        return kysecLogo;
      } else if (this.isCuamEnv) {
        return cuamLogo;
      } else {
        return '';
      }
    },
    containerClass() {
      return this.config.sys;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-layout {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('../assets/img/kysec-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  &.szse,
  &.swse,
  &.guosen {
    background-image: url('../assets/img/ht-login-background.png');
  }
  &.cicc {
    background-image: url('../assets/img/cicc-bg.png');
  }
  &.xyzq {
    background-image: url('../assets/img/xyzq-bg.png');
  }
  &.citics {
    background-image: url('../assets/img/citic-login-bg.png');
  }
  &.dxzq {
    background-image: url('../assets/img/dxzq/bg.png');
  }
  &.cms,
  &.htffund {
    background-image: none;
    background-color: #f6f7f8;
  }
  &.htffund {
    background-color: #f6f6f6;
    header {
      height: 60px;
      background-color: #24233a;
    }
    .client-logo {
      width: 380px;
      left: 30px;
      top: 10px;
    }
  }

  .client-logo {
    position: absolute;
    left: 30px;
    top: 30px;
    width: 200px;
  }
}
</style>

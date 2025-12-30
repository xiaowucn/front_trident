<template>
  <div class="custom-login-wrapper" :class="containerClass">
    <div class="login-left">
      <img :src="clientLoginImageUrl.left" alt="slogan" />
    </div>
    <div class="login-right">
      <img :src="clientLoginImageUrl.right" alt="logo" class="logo" />
      <login-form />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import LoginForm from '../../components/login/login-form.vue';

// 使用 eager: true 因为登录页面图片需要立即显示
const loginImages = import.meta.glob('../../assets/img/*/slogan.png', {
  eager: true,
  import: 'default',
});
const loginTitleImages = import.meta.glob(
  '../../assets/img/*/login-title.png',
  {
    eager: true,
    import: 'default',
  },
);

export default {
  name: 'CustomLoginContainer',
  components: { LoginForm },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    containerClass() {
      return this.config.sys;
    },
    clientLoginImageUrl() {
      // Find matching images based on containerClass
      const sloganKey = Object.keys(loginImages).find((key) =>
        key.includes(`/${this.containerClass}/slogan.png`),
      );
      const titleKey = Object.keys(loginTitleImages).find((key) =>
        key.includes(`/${this.containerClass}/login-title.png`),
      );

      return {
        left: sloganKey ? loginImages[sloganKey] : '',
        right: titleKey ? loginTitleImages[titleKey] : '',
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-login-wrapper {
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .login-left {
    img {
      width: 450px;
      height: 100%;
    }
  }

  .login-right {
    width: 450px;
    padding: 25px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    .logo {
      width: 80%;
    }
  }

  &.htffund {
    .login-left {
      img {
        width: 550px;
        height: 100%;
      }
    }
    .login-right {
      .logo {
        width: 55%;
      }
    }
    ::v-deep .login-btn {
      margin: 45px 0 0 0;
      button {
        font-size: 18px;
        border: none;
        background-image: linear-gradient(269deg, #d38a68 1%, #a75237 100%);
      }
    }
  }

  ::v-deep .el-form {
    width: 65%;
  }
  ::v-deep .el-form-item__label {
    display: none;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
    width: 100%;
  }
  ::v-deep .login-btn {
    margin: 45px 0 0 0;
    button {
      font-size: 18px;
      background-color: #b7281d;
      border: 1px solid #b7281d;
    }
  }
}
</style>

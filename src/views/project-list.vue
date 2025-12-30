<template>
  <div
    v-if="isShowSystemList"
    class="project-container"
    :class="containerClass">
    <div v-if="isFULLGOALEnv" class="container-title">智能文档处理平台</div>
    <div class="list-wrapper">
      <template v-if="isShowCustomSystem">
        <custom-system-content
          v-for="(info, index) in allowSystemList"
          :key="index"
          :system-info="info"
          @click-system-item="goToOtherSys">
        </custom-system-content>
      </template>
      <template v-else>
        <system-content
          v-for="(info, index) in allowSystemList"
          :key="index"
          :system-info="info"
          @click-system-item="goToOtherSys">
        </system-content>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import CustomSystemContent from '../components/custom-system-content.vue';
import SystemContent from '../components/system-content.vue';
import { determineBrowserVersion, validateExpire } from '@/tools';
import { getOtherSysUrl } from '@/api/sys-info';
import { baseURL } from '@/tools/request';

export default {
  name: 'ProjectList',
  components: {
    SystemContent,
    CustomSystemContent,
  },
  inject: ['getSystemsList'],
  computed: {
    ...mapGetters('SysInfo', ['config']),
    isShowCustomSystem() {
      return ['cicc', 'xyzq', 'citics'].includes(this.config.sys);
    },
    isCiccEnv() {
      return this.$platform.isCiccEnv();
    },
    isFULLGOALEnv() {
      return this.$platform.isFULLGOALEnv();
    },
    isShowSystemList() {
      if (this.$platform.isJHZQEnv()) {
        return !this.$features.isSelfSystemAdmin();
      }
      return true;
    },
    allowSystemList() {
      return this.getSystemsList();
    },
    containerClass() {
      return this.config.sys;
    },
  },
  mounted() {
    if (this.allowSystemList.length === 0 && this.$platform.isCiticsTgEnv()) {
      this.$message.error(
        '您当前未被授予任何系统权限，请联系管理员进行系统权限配置',
      );
    }
  },
  methods: {
    async goToOtherSys(sysInfo) {
      if (determineBrowserVersion() && sysInfo.sysName === 'autodoc_overall') {
        this.$router.push('browserVersion');
      } else {
        // 中金进入autodoc系统后，里面存在对比任务，可以点击跳转calliper，所以进入autodoc也要登录下calliper
        if (this.isCiccEnv && sysInfo.sysName.includes('autodoc')) {
          this.loginCalliper();
        }

        if (validateExpire(this.config, sysInfo.sysName)) {
          return;
        }

        const { origin } = this.$route.query;
        if (this.$platform.isZtsEnv()) {
          window.location.href = getOtherSysUrl(sysInfo.sysName, origin);
          return;
        }

        try {
          await this.$store.dispatch('UserInfo/getLoggStatus');
          window.open(getOtherSysUrl(sysInfo.sysName, origin));
        } catch (e) {
          this.$router.push('/login');
        }
      }
    },
    loginCalliper() {
      const iframe = document.createElement('iframe');
      iframe.src = `${baseURL}/get-off?sys=calliper`;
      iframe.style.display = 'none';
      this.$el.appendChild(iframe);
      iframe.onload = () => {
        this.$el.removeChild(iframe);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.project-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1200px;
  margin: 10vh auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  &.cgs {
    .list-wrapper {
      justify-content: center;
    }
  }
  &.cms {
    margin-top: 40vh;
  }
  &.htffund {
    width: auto;
    margin-top: 32vh;
  }
  &.xyzq {
    width: 1200px;
    ::v-deep .system-wrapper {
      width: 238px;
      margin: 0 50px;
    }
  }
  &.kysec {
    margin-top: 88px;
  }
  &.fullgoal {
    flex-direction: column;
    .container-title {
      color: transparent;
      background: linear-gradient(to right, #1775f7, #0c5ecc);
      background-clip: text;
      font-size: 40px;
      font-weight: 700;
      margin-bottom: 50px;
      line-height: 48px;
    }
  }
  &.citics {
    flex-flow: column;
    justify-content: space-around;
    border-radius: 7px;
    text-decoration: none;
    cursor: pointer;
    ::v-deep .svg-icon {
      width: 115px;
      height: 115px;
    }
    ::v-deep .system-wrapper {
      flex: 1;
      width: auto;
      margin: 10px;
      padding: 0;
      &:hover {
        .project-describe {
          h2 {
            color: #4d75e0;
          }
        }
      }
      .project-describe {
        width: 100%;
        margin-top: 44px;
        color: #333333;
        h2 {
          height: 70px;
          font-weight: 400;
          font-size: 24px;
          color: #333333;
          letter-spacing: 0;
        }
      }
    }
  }
  &.icbccs {
    display: block;
    margin-top: 240px;
    ::v-deep .system-wrapper {
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #d5d5d5;
      box-sizing: border-box;
      text-align: left;
      .svg-icon {
        width: 85px;
      }
      .project-describe {
        h2 {
          font-size: 21px;
          color: #333333;
        }
        span {
          color: #888;
        }
      }
      &:hover {
        border: 1px solid #f31444;
        box-shadow: 0px 0px 19px 0px rgba(126, 16, 16, 0.25);
      }
    }
  }
  &.cicc {
    align-items: normal;
    .list-wrapper {
      display: flex;
      justify-content: space-around;
      flex-flow: row;
      width: 900px;
      margin: 100px auto;
      ::v-deep .system-wrapper {
        width: 233px;
        border-radius: 6px;
        .svg-icon {
          width: 85px;
          height: 85px;
        }
        .project-describe {
          h2 {
            font-size: 21px;
            color: #ffffff;
            letter-spacing: 0;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
          }
        }
      }
    }
  }
  &.htamc {
    min-width: 1200px;
    .list-wrapper {
      justify-content: flex-start;
      width: 900px;
    }
    ::v-deep .system-wrapper {
      width: 399px;
      height: 199px;
      border-radius: 4px;
      border: 1px solid #b1bccf;
      box-sizing: border-box;
      text-align: left;
      background: rgba(251, 251, 251, 0.7);
      margin: 24px;
      padding: 29px 31px 30px 30px;
      align-items: flex-start;
      .svg-icon {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
      }
      .project-describe {
        h2 {
          font-size: 20px;
          color: #3e3f42;
          margin-left: 13px;
          margin-bottom: 18px;
          height: 48px;
          line-height: 48px;
          font-weight: 400;
        }
        span {
          color: #6b6c6f;
          font-size: 14px;
          margin-left: -48px;
          display: inline-block;
          line-height: 24px;
        }
      }
      &:hover {
        border: 1px solid #89a3f0;
        box-shadow: 0px 0px 8px 0px #89a3f0;
      }
    }
  }
  .list-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>

<template>
  <div class="system-wrapper" :class="containerClass" @click="goToOtherSys">
    <svg-icon :icon-class="systemInfo.icon"></svg-icon>
    <div class="project-describe">
      <h2 class="project-name" v-html="systemInfo.name"></h2>
      <span>{{ systemInfo.captions }}</span>
    </div>
  </div>
</template>
<script>
import SvgIcon from '../components/svg-icon.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'SystemContent',
  components: {
    SvgIcon,
  },
  props: {
    systemInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    containerClass() {
      return this.config.sys;
    },
  },
  methods: {
    goToOtherSys() {
      this.$emit('click-system-item', this.systemInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.system-wrapper {
  width: 580px;
  height: 220px;
  padding: 10px 42px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 7px;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }

  img {
    width: 85px;
  }

  .project-describe {
    width: 370px;

    .project-name {
      font-size: 25px;
      margin: 0 0 10px 0;

      ::v-deep em {
        font-size: 20px;
        font-style: normal;
        color: #fc8d3c;
      }
    }
  }

  &.cms {
    width: 500px;
    color: #666;
    margin: 20px;
    border: 1px solid #d8d8d8;
    border-radius: 0;
    position: relative;

    ::v-deep .svg-icon {
      position: absolute;
      top: 22px;
      left: 40px;
    }

    .project-describe {
      width: 100%;

      .project-name {
        margin-left: 80px;
        margin-bottom: 20px;
      }
    }
  }

  &.htffund {
    width: 410px;
    height: 195px;
    flex-direction: column;
    align-items: start;
    color: #303133;
    padding: 20px 30px;
    position: relative;
    border: 1px solid #eaedf3;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    .svg-icon {
      position: absolute;
      top: -12px;
      left: 30px;
      transform: scale(1.3);
    }

    .project-describe {
      width: 100%;

      .project-name {
        width: 100%;
        text-align: center;
        font-weight: normal;
        border-bottom: 1px solid #eaedf3;
        padding-bottom: 20px;
        margin-bottom: 24px;
      }

      span {
        color: #909399;
      }
    }
  }

  &.fullgoal {
    width: 568px;
    margin: 16px;
    color: #464b56;
    line-height: 1.6;
  }
}
</style>

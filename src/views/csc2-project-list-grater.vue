<template>
  <div class="csc2-grater-projects-wrapper">
    <div class="title-wrapper">
      <span class="content">银行流水服务</span>
    </div>
    <div class="csc2-grater-project-content">
      <csc2-project-detail
        v-for="(info, index) in projectInfo"
        :key="index"
        :name="info.title"
        :icon="info.icon"
        :hover-icon="info.hoverIcon"
        :sys-name="info.sysName"
        :path="info.path"
        :is-open="info.isOpen">
      </csc2-project-detail>
    </div>
  </div>
</template>
<script>
import Csc2ProjectDetail from '@/components/csc2-detail.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'Csc2ProjectListGrater',
  components: {
    Csc2ProjectDetail,
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    projectInfo() {
      return [
        {
          title: '识别入口',
          icon: 'identify',
          hoverIcon: 'identify-hover',
          sysName: 'grater',
          path: '/#/project/identify',
          isOpen: !!this.config.grater_open,
        },
        {
          title: '分析入口',
          icon: 'analysis',
          hoverIcon: 'analysis-hover',
          sysName: 'grater',
          path: '/#/project/analysis',
          isOpen: !!this.config.grater_open,
        },
      ].filter((item) => item.isOpen);
    },
  },
};
</script>

<style lang="scss" scoped>
.csc2-grater-projects-wrapper {
  position: relative;
  .csc2-grater-project-content {
    display: flex;
    justify-content: center;
    margin: 123px auto 0 auto;
    padding: 0 100px 30px;
    row-gap: 10px;
    flex-flow: row wrap;
    .detail-wrapper {
      width: 20%;
    }
  }
  .title-wrapper {
    background: url('../assets/img/grater-banner.png') center center no-repeat;
    background-size: 100% 320px;
    width: 100%;
    height: 300px;
    text-align: center;
    line-height: 300px;
    .content {
      font-size: 56px;
      color: #ffffff;
      letter-spacing: 0;
      text-shadow: 0 0 4px rgba(0, 0, 0, 0.28);
    }
  }
}
</style>

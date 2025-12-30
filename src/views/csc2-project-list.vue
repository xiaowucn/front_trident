<template>
  <div class="csc2-projects-wrapper">
    <div class="title-wrapper">
      <span class="csc2-title">金融文档智能服务平台</span>
    </div>
    <div class="csc2-project-content">
      <csc2-project-detail
        v-for="(info, index) in allowSystemList"
        :key="index"
        :name="info.name"
        :icon="info.icon"
        :hover-icon="info.hoverIcon"
        :sys-name="info.sysName">
      </csc2-project-detail>
    </div>
  </div>
</template>
<script>
import Csc2ProjectDetail from '../components/csc2-detail.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'Csc2ProjectList',
  components: {
    Csc2ProjectDetail,
  },
  inject: ['getSystemsList'],
  computed: {
    ...mapGetters('SysInfo', ['config']),
    allowSystemList() {
      return this.getSystemsList();
    },
  },
};
</script>

<style lang="scss" scoped>
.csc2-projects-wrapper {
  position: relative;
  .csc2-project-content {
    display: flex;
    justify-content: center;
    margin: 123px auto 0 auto;
    padding: 0 100px 30px;
    row-gap: 10px;
    flex-flow: row wrap;
    .csc2-system-wrapper {
      width: 20%;
    }
  }
  .title-wrapper {
    background: url('../assets/img/csc2-banner.png') center center no-repeat;
    background-size: 100% 320px;
    width: 100%;
    height: 300px;
    text-align: center;
    line-height: 300px;
    .csc2-title {
      font-size: 56px;
      color: #ffffff;
      letter-spacing: 0;
      text-shadow: 0 0 4px rgba(0, 0, 0, 0.28);
    }
  }
}
</style>

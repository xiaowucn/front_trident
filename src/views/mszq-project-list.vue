<template>
  <div class="mszq-projects-wrapper">
    <div class="project-content">
      <div
        v-for="(info, index) in allowSystemList"
        :key="index"
        class="detail-wrapper"
        @click="goToOtherSys(info)">
        <svg-icon :icon-class="info.icon"></svg-icon>
        <div class="project-describe">
          <h2>{{ info.name }}</h2>
          <span v-html="info.captions"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { determineBrowserVersion } from '@/tools';
import { getOtherSysUrl } from '@/api/sys-info';
import { mszqProjectInfo } from '@/tools/constants';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'MszqProjectList',
  inject: ['systemsByPermission'],
  computed: {
    ...mapGetters('SysInfo', ['config']),
    autodocTaskTypes() {
      return this.config.autodoc_task_types || {};
    },
    queryTaskTypes() {
      return this.$route.query.task_types;
    },
    allowSystemList() {
      const list = [];
      mszqProjectInfo.forEach(sysInfo => {
        if (this.systemsByPermission().includes(sysInfo.sysName)) {
          let sysTitle = `${sysInfo.sysName}_title`;
          if (sysInfo.sysName === 'autodoc_overall') {
            // 民生证券autodoc系统拆分为三个人口，系统文案前端配置
            if (this.queryTaskTypes === sysInfo.type || !this.queryTaskTypes) {
              list.push(sysInfo);
            }
          } else {
            list.push({
              ...sysInfo,
              name: this.config[sysTitle] || sysInfo.name,
            });
          }
        }
      });
      return list;
    },
  },
  methods: {
    ...mapActions('UserInfo', ['getLoggStatus']),
    async goToOtherSys(sysInfo) {
      if (determineBrowserVersion() && sysInfo.sysName === 'autodoc_overall') {
        this.$router.push('browserVersion');
      } else if (sysInfo.isOpen) {
        try {
          await this.getLoggStatus();
          if (sysInfo.sysName === 'autodoc_overall' && sysInfo.type) {
            // autodoc跳转
            const taskTypes = this.autodocTaskTypes[sysInfo.type];
            window.open(getOtherSysUrl(sysInfo.sysName, null, taskTypes));
            return;
          }
          window.open(getOtherSysUrl(sysInfo.sysName));
        } catch (e) {
          this.$router.push('/');
        }
      } else {
        this.$notify.info({
          message: '项目类型授权已过期',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mszq-projects-wrapper {
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
  .project-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .detail-wrapper {
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
        h2 {
          font-size: 25px;
          margin: 0 0 10px 0;
        }
      }
    }
  }
}
</style>

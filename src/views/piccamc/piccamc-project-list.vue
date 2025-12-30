<template>
  <div class="project-list-wrapper">
    <div class="project-content" :data-length="projectGroups.length">
      <div
        v-for="(info, index) in projectGroups"
        :key="index"
        class="project-item"
        :class="info.type"
        @click="goToOtherSys(info)">
        <svg-icon :icon-class="info.icon" class="system-icon"></svg-icon>
        <div class="system-desc">
          <div class="title">{{ info.name }}</div>
          <div
            v-for="caption in info.captions"
            :key="caption.key"
            class="content">
            <span class="key">{{ caption.key }}</span>
            <span>{{ caption.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { determineBrowserVersion } from '@/tools';
import { getOtherSysUrl } from '@/api/sys-info';
import { piccamcProjectInfo } from '@/tools/piccamc-constants';
import _ from 'lodash';
export default {
  name: 'HtProjectList',
  inject: ['getSystemsList'],
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    ...mapGetters('SysInfo', ['config']),

    autodocTaskTypes() {
      return this.config.autodoc_task_types || {};
    },
    allowSystemList() {
      return this.getSystemsList();
    },
    filterProjectListByConfig() {
      return piccamcProjectInfo
        .filter(item => {
          const userEnable = this.allowSystemList.find(
            sys => sys.sysName === item.sysName,
          );
          if (item.sysName === 'autodoc_overall') {
            return this.config.overall_open && userEnable;
          } else {
            return this.config[`${item.sysName}_open`] && userEnable;
          }
        })
        .map(item => {
          return {
            ...item,
            name: this.config[`${item.sysName}_title`] || item.name,
          };
        });
    },

    projectGroups() {
      const filterProjects = this.filterProjectListByConfig.filter(item => {
        if (item.sysName === 'autodoc_overall') {
          const autodocDataCategory =
            this.userInfo.user_data.autodoc_data &&
            this.userInfo.user_data.autodoc_data.category
              ? _.pickBy(
                  this.userInfo.user_data.autodoc_data.category,
                  item => item,
                )
              : null;
          const validTaskTypes = Object.keys(
            autodocDataCategory || this.autodocTaskTypes,
          );
          return validTaskTypes.includes(item.type);
        } else {
          if (!_.isEmpty(this.userInfo.user_data.categories) && !item.isTool) {
            return this.userInfo.user_data.categories[item.sysName];
          } else {
            return true;
          }
        }
      });
      return filterProjects;
    },
  },
  methods: {
    ...mapActions('UserInfo', ['getLoggStatus']),
    getFilterProject(projects) {
      return {
        tools: projects.filter(item => item.isTool),
        systems: projects.filter(item => !item.isTool),
      };
    },
    async goToOtherSys(sysInfo) {
      await this.getLoggStatus();
      if (
        !_.isEmpty(this.userInfo.user_data.categories) &&
        !this.userInfo.user_data.categories[sysInfo.type]
      ) {
        this.$notify.warning({
          message: '无操作权限',
        });
        return;
      }
      if (determineBrowserVersion() && sysInfo.sysName === 'autodoc_overall') {
        this.$router.push('browserVersion');
      } else if (sysInfo.isOpen) {
        if (sysInfo.sysName === 'autodoc_overall' && sysInfo.type) {
          const taskTypes = this.autodocTaskTypes[sysInfo.type];
          window.open(getOtherSysUrl(sysInfo.sysName, null, taskTypes));
          return;
        }
        window.open(getOtherSysUrl(sysInfo.sysName));
      } else if (sysInfo.isInternal) {
        this.$router.push({ name: sysInfo.type });
      } else {
        this.$notify.info({
          message: '目前服务暂未开放，敬请期待',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.project-list-wrapper {
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
.project-content {
  display: flex;
  max-width: 1680px;
  min-width: 1290px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin: 0 100px;
  &[data-length='1'] {
    justify-content: center;
  }
  .project-item {
    flex: 0 0 calc(33.33% - 20px);
    padding: 15px 20px 15px 10px;
    margin: 10px;
    min-height: 240px;
    max-width: 585px;
    min-width: 410px;
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    box-sizing: border-box;
    align-items: center;
    text-decoration: none;
    color: white;
    cursor: pointer;
    position: relative;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    border: 2px solid transparent;
    &:hover {
      box-shadow: 0 0 20px 0 rgba(16, 66, 126, 0.2);
      background-color: rgba(255, 255, 255, 0.3);
    }
    .system-icon {
      width: 66px;
      height: 66px;
      flex-shrink: 0;
      // position: absolute;
      // top: -30px;
      margin-right: 15px;
    }
    .system-desc {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .title {
        font-size: 22px;
        font-weight: bold;
        margin: 0 0 5px 0;
        color: white;
      }
    }
    .content {
      font-size: 14px;
      line-height: 22px;
      margin-top: 5px;
      text-align: justify;
      .key {
        color: rgba(255, 255, 255, 0.6);
        font-weight: 500;
      }
    }
    .sub-title {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>

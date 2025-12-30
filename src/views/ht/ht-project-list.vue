<template>
  <div class="ht-project-list">
    <p class="nav-title">
      文档智能审核
      <span class="description">
        支持PDF、Word、Excel格式；支持主文档与底稿关联审核
      </span>
    </p>
    <div class="ht-project-content">
      <div
        v-for="(info, index) in projectGroups.systems"
        :key="index"
        class="project-item"
        :class="info.type"
        @click="goToOtherSys(info)">
        <div v-if="isShowToCompareTips(info)" class="model-tips">
          敬请期待...
        </div>
        <svg-icon :icon-class="info.icon" class="system-icon"></svg-icon>
        <div class="system-desc">
          <div class="title">{{ info.name }}</div>
          <div class="content" v-html="info.captions"></div>
        </div>
      </div>
    </div>

    <p class="nav-title">智能工具</p>
    <div class="ht-project-content">
      <div
        v-for="(info, index) in projectGroups.tools"
        :key="index"
        class="project-item tool"
        :class="isShowToCompareTips(info) ? 'to-compare' : ''"
        @click="goToOtherSys(info)">
        <div v-if="isShowToCompareTips(info)" class="model-tips">
          敬请期待...
        </div>

        <div class="title-header">
          <svg-icon :icon-class="info.icon"></svg-icon>
          <span>{{ info.name }}</span>
        </div>
        <div class="content" v-html="info.captions"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { determineBrowserVersion } from '@/tools';
import { getOtherSysUrl } from '@/api/sys-info';
import { htProjectInfo } from '@/tools/ht-constants';
import _ from 'lodash';
export default {
  name: 'HtProjectList',
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    ...mapGetters('SysInfo', ['config']),

    autodocTaskTypes() {
      return this.config.autodoc_task_types || {};
    },
    filterHtProjectListByConfig() {
      return htProjectInfo
        .filter(item => {
          if (item.sysName === 'autodoc_overall' || item.isInternal) {
            return true;
          } else {
            return this.config[`${item.sysName}_open`];
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
      const filterProjects = this.filterHtProjectListByConfig.filter(item => {
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
      if (this.userInfo.is_oa || this.userInfo.is_admin) {
        const projects = filterProjects.filter(sys => !sys.isHidden);
        return this.getFilterProject(projects);
      }
      // 海通证券非OA或admin用户只展示全面复核（autodoc_overall）
      const projectList = filterProjects.filter(
        sys => sys.sysName === 'autodoc_overall' || sys.isTool,
      );
      return this.getFilterProject(projectList);
    },
  },
  methods: {
    ...mapActions('UserInfo', ['getLoggStatus']),
    isShowToCompareTips(systemInfo) {
      return systemInfo.configKey && !this.config[systemInfo.configKey];
    },
    getFilterProject(projects) {
      return {
        tools: projects.filter(item => item.isTool),
        systems: projects.filter(item => !item.isTool),
      };
    },
    async goToOtherSys(sysInfo) {
      if (this.isShowToCompareTips(sysInfo)) {
        return;
      }
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
.ht-project-list {
  width: 1280px;
  margin: 8vh auto 0 auto;
  &::after {
    content: '';
    clear: both;
  }
  .nav-title {
    font-size: 22px;
    font-weight: bold;
    color: #606266;
    margin-top: 0;
    &::before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #1665d8;
      margin: 10px 10px 3px 0;
    }
    .description {
      font-size: 14px;
      font-weight: normal;
    }
  }
  .ht-project-content {
    display: inline-grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-gap: 40px;
    margin-bottom: 60px;
    margin-top: 50px;
    .project-item {
      width: 400px;
      min-height: 200px;
      padding: 20px 42px;
      margin-bottom: 40px;
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      box-sizing: border-box;
      align-items: center;
      color: #888;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      background-color: #ffffff;
      border-radius: 8px;
      border: 2px solid transparent;
      &:hover {
        box-shadow: 0 0 20px 0 rgba(16, 66, 126, 0.2);
        &.ipo {
          border: 2px solid #b8ceea;
        }
        &.bond {
          border: 2px solid #c9cdec;
        }
        &.neeq {
          border: 2px solid #e1d1d1;
        }
        &.inquiry {
          border: 2px solid #c8d9dd;
        }
        &.scriber {
          border: 2px solid #d9e3d9;
        }
        &.fund_scriber {
          border: 2px solid #8549bc80;
        }
        &.official {
          border: 2px solid #dfcdbb;
        }
      }
      .system-icon {
        width: 70px;
        position: absolute;
        top: -30px;
      }
      .system-desc {
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0;
          color: #666;
        }
      }
      .model-tips {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #efefef;
        opacity: 0.7;
        left: 0;
        color: #232323;
        font-size: 30px;
        font-weight: bold;
        line-height: 7;
        text-align: center;
        cursor: not-allowed;
      }
      &.tool {
        background: #fcfdfc;
        border: 2px solid #e2e5ec;
        align-items: start;
        .title-header {
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
          span {
            margin-left: 10px;
            color: #666;
          }
        }
      }
      &.to-compare {
        &:hover {
          box-shadow: none;
        }
      }
      .content {
        font-size: 14px;
      }
    }
  }
}
</style>

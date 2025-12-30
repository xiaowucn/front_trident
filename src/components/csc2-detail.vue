<template>
  <div
    class="csc2-system-wrapper"
    @click="goToOtherSys"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false">
    <svg-icon :icon-class="isHover ? hoverIcon : icon"></svg-icon>
    <div class="project-describe">
      <h2>{{ name }}</h2>
    </div>
  </div>
</template>
<script>
import SvgIcon from '../components/svg-icon.vue';
import { getOtherSysUrl } from '../api/sys-info';
import { mapGetters } from 'vuex';
import { EventBus } from '../tools/event-bus';

export default {
  name: 'Csc2ProjectDetail',
  components: {
    SvgIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    hoverIcon: {
      type: String,
      required: true,
    },
    sysName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isHover: false,
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
  },
  methods: {
    goToOtherSys() {
      if (this.sysName === 'grater') {
        if (
          this.userInfo.sys_requires &&
          this.userInfo.sys_requires.length > 0
        ) {
          const sysApproval = this.userInfo.sys_requires.find(
            (item) => item.sys === this.sysName,
          );
          if (sysApproval && sysApproval.status !== 1) {
            this.$notify.warning({
              message: '已经申请过该系统，请等待审批',
            });
            return;
          }
        }
        const userRole = this.userInfo.roles[0].permission[this.sysName];
        if (
          this.$features.isEnableSysRequire() &&
          (!userRole || userRole.length === 0)
        ) {
          EventBus.$emit('open-system-approval-dialog');
        } else {
          if (this.$router.history.current.name === 'projectGrater') {
            window.open(getOtherSysUrl(this.sysName, this.path));
          } else {
            this.$router.push({ name: 'projectGrater' });
          }
        }
      } else {
        window.open(getOtherSysUrl(this.sysName));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.csc2-system-wrapper {
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 7px;
  text-decoration: none;
  cursor: pointer;
  ::v-deep .svg-icon {
    width: 115px;
    height: 115px;
  }
  .project-describe {
    width: 100%;
    margin-top: 44px;
    white-space: nowrap;
    text-align: center;
    h2 {
      font-weight: 400;
      font-size: 24px;
      color: #333333;
      letter-spacing: 0;
    }
  }
}
</style>

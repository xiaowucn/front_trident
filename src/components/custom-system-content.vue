<template>
  <div
    class="system-wrapper"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @click="goToOtherSys">
    <svg-icon v-if="!isNeedHoverIcon" :icon-class="systemInfo.icon"> </svg-icon>
    <svg-icon
      v-else
      :icon-class="isHover ? systemInfo.hoverIcon : systemInfo.icon">
    </svg-icon>
    <div class="project-describe">
      <h2>{{ systemInfo.name }}</h2>
    </div>
  </div>
</template>
<script>
import SvgIcon from '../components/svg-icon.vue';
export default {
  name: 'CustomSystemContent',
  components: {
    SvgIcon,
  },
  props: {
    systemInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isHover: false,
    };
  },
  computed: {
    isNeedHoverIcon() {
      return this.$platform.isCiticEnv();
    },
  },
  methods: {
    goToOtherSys() {
      if (this.systemInfo.url) {
        window.open(this.systemInfo.url);
      } else {
        this.$emit('click-system-item', this.systemInfo);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.system-wrapper {
  width: 210px;
  height: 210px;
  padding: 10px 42px;
  margin: 10px 0;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  box-sizing: border-box;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 7px;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  img {
    width: 85px;
  }
  .project-describe {
    width: 100%;
    h2 {
      text-align: center;
      font-size: 25px;
      margin: 0 0 10px 0;
    }
  }
}
</style>

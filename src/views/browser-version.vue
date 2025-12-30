<template>
  <div class="version-wrapper" :class="{ ht: $platform.isHtEnv() }">
    <div>
      <svg-icon icon-class="chrome-logo"></svg-icon>
      <h3>请使用Chrome{{ version }}以上版本访问</h3>
    </div>
  </div>
</template>

<script>
import { autodocMinimumBrowserVersion } from '@/tools';

export default {
  name: 'BrowserVersion',
  data() {
    return {
      version: autodocMinimumBrowserVersion,
    };
  },
};
</script>

<style lang="scss" scoped>
.version-wrapper {
  display: flex;
  height: calc(100% - 97px);
  flex-flow: column;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  &.ht {
    color: #000;
  }
}
</style>

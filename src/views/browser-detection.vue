<template>
  <div class="detection-wrapper">
    <div class="content">请使用Chrome浏览器访问</div>
  </div>
</template>

<script>
export default {
  name: 'BrowserDetection',
};
</script>

<style lang="scss" scoped>
.detection-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  .content {
    font-size: 18px;
    margin-top: 100px;
    text-align: center;
  }
}
</style>

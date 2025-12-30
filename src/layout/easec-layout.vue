<template>
  <div class="easec-layout">
    <header>
      <a href="/" class="logo">东亚前海证券</a>
    </header>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'EasecLayout',
};
</script>

<style lang="scss" scoped>
.easec-layout {
  width: 100%;
  height: 100%;
  background-color: #fbfbfb;
  position: relative;
  header {
    width: 100%;
    display: flex;
    align-items: center;
    height: 64px;
    background-color: #c00000;
    padding: 0 40px;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    .logo {
      width: 196px;
      height: 40px;
      background: url(../assets/img/easec-logo.png) no-repeat center / 100% 100%;
      text-indent: -9999px;
    }
  }
}
</style>

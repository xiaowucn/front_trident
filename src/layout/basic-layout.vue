<template>
  <div class="basic-layout">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'BasicLayout',
};
</script>

<style lang="scss" scoped>
.basic-layout {
  width: 100%;
  height: 100%;
}
</style>

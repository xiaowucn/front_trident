<template>
  <div class="wrong-permissions-wrapper">
    <div class="wrong-permissions">
      <img src="../assets/img/403.svg" alt="403" width="416" />
      <p class="describe">{{ errorTips }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WrongPermissions',
  computed: {
    errorTips() {
      if (this.$platform.isCmfchinaEnv()) {
        return '您当前未被授予任何系统权限，请联系管理员进行系统权限配置';
      }
      return '用户权限不足';
    },
  },
};
</script>

<style scoped lang="scss">
.wrong-permissions-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbfbfd;
  .wrong-permissions {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    .describe {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>

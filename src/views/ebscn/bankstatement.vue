<template>
  <iframe :src="getSrc()" frameborder="0"></iframe>
</template>
<script>
export default {
  name: 'EbscnBankStatement',
  data() {
    return {};
  },
  methods: {
    getSrc() {
      const params = Object.entries(this.$route.query).map(([key, value]) => {
        return `${key}=${value}`;
      });
      const paramsStr = params.join('&');
      return `/grater/#/project-manage?${paramsStr}`;
    },
  },
};
</script>
<style lang="scss" scoped>
iframe {
  width: 100%;
  height: calc(100% - 6px);
}
</style>

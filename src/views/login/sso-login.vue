<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'SsoLogin',
  computed: {
    ...mapGetters('SysInfo', ['config']),
  },
  async created() {
    await this.$store.dispatch('SysInfo/getConfig');
    window.location.href = `${window.location.origin}/${this.config.redirect_subpath}api/v1/guosen/sso-login?app=trident`;
  },
};
</script>

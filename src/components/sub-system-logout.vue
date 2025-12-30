<template>
  <div class="sub-system-logout-wrapper">
    <iframe
      v-for="(info, key) in availableSys"
      :key="key"
      ref="logoutIframe"
      :src="getLogoutUrl(info.logout_api)">
    </iframe>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SubSystemLogout',
  data() {
    return {};
  },
  computed: {
    ...mapGetters('SysInfo', ['availableSys']),
  },
  methods: {
    getLogoutUrl(logoutUrl) {
      if (logoutUrl.startsWith('http')) {
        return logoutUrl;
      }
      return `${window.location.origin}/${logoutUrl}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-system-logout-wrapper {
  display: none;
}
</style>

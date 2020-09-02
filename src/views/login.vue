<template>
  <div>正在重定向至授权页面...</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState(['config']),
  mounted() {
    const url = new URL(this.config.redirectUrl);
    if (this.$route.query.redirect) {
      url.searchParams.append('redirectURL', `/opinionsuggestion${this.$route.query.redirect}`);
    }
    window.location = `https://open.weixin.qq.com/connect/oauth2/authorize?${new URLSearchParams({
      appid: this.config.corpId,
      redirect_uri: encodeURIComponent(url.href),
      response_type: 'code',
      scope: this.config.scope,
      agentid: this.config.agentId,
      state: 'app',
    })}#wechat_redirect`;
  },
};
</script>

<template>
  <div>正在重定向至授权页面...</div>
</template>

<script>
export default {
  mounted() {
    const url = new URL(process.env.VUE_APP_WECHAT_REDIRECT_URI);
    if (this.$route.query.redirect) {
      url.searchParams.append('redirectURL', `/feedback${this.$route.query.redirect}`);
    }
    window.location = `https://open.weixin.qq.com/connect/oauth2/authorize?${new URLSearchParams({
      appid: process.env.VUE_APP_WECHAT_APP_ID,
      redirect_uri: encodeURIComponent(url.href),
      response_type: 'code',
      scope: process.env.VUE_APP_WECHAT_SCOPE,
      agentid: process.env.VUE_APP_WECHAT_AGENT_ID,
      state: 'app',
    })}#wechat_redirect`;
  },
};
</script>

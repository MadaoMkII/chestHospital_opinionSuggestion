<template>
  <div>正在登录...</div>
</template>

<script>
export default {
  async mounted() {
    if (this.$route.query.userid) {
      await this.$axios.post('/api/user/login', { USERID: this.$route.query.userid });
      await this.$router.push({ name: 'index' });
      window.location.reload();
    }
  },
};
</script>

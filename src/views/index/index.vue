<template>
  <div>Index</div>
</template>

<script>
export default {
  async created() {
    const response = await this.$axios.post('/api/opinionSuggestion/getOpinionSuggestionDetail', {
      uuid: 'ckce7ysjf000230tn6si9dfx1',
    });
    console.log(response);
  },
};
</script>

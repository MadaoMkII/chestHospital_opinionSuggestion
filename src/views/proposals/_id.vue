<template>
  <div v-if="proposal">
    <van-cell-group>
      <van-cell
        :title="`关于【${proposal.title}】的${proposal.type}`"
        :border="false"
      />
      <van-cell
        title="提交人"
      >
        <div class="user">
          <van-image
            class="user__avatar"
            width="24px"
            height="24px"
            fit="cover"
            round
            :src="proposal.creator.avatar"
          />
          <div class="user__name">
            <div class="van-ellipsis">
              {{ proposal.creator.nickName }}
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell
        title="分类"
        :value="proposal.category"
      />
      <van-cell
        title="内容"
        :label="proposal.content"
      />
      <van-cell
        title="状态"
        :value="proposal.status"
      />
    </van-cell-group>
    <van-cell-group title="操作历史" />
    <div class="submit-bar">
      <van-grid
        clickable
        :column-num="4"
      >
        <van-grid-item
          clickable
          text="回复"
        />
        <van-grid-item
          clickable
          text="指派"
        />
        <van-grid-item
          clickable
          text="协同"
        />
        <van-grid-item
          clickable
          text="处理"
        />
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      proposal: null,
    };
  },
  async created() {
    this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
  },
  methods: {
    async fetchProposal(params) {
      const response = await this.$axios.post('/api/opinionSuggestion/getOpinionSuggestionDetail', params);
      return response.data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
  .user {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &__avatar {
      flex-shrink: 0;
      margin-right: 10px;
    }
    &__name {
      overflow: hidden;
    }
  }
</style>

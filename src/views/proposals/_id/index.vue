<template>
  <div
    class="has-submit-bar"
    v-if="proposal"
  >
    <van-nav-bar
      title="意见建议"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    />
    <van-cell-group title="基本信息">
      <van-cell
        :title="`关于【${proposal.title}】的${proposal.type}`"
        :border="false"
      />
      <van-cell
        title="提交人"
        :border="false"
      >
        <div class="user user--right">
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
        :border="false"
      />
      <van-cell
        title="状态"
        :value="proposal.status"
        :border="false"
      />
      <van-cell
        class="content-cell"
        title="内容"
        :label="proposal.content"
        :border="false"
      />
    </van-cell-group>
    <van-cell-group
      v-if="proposal.operationHistory.length"
      title="操作历史"
    >
      <template v-for="(opt, i) in proposal.operationHistory">
        <van-cell
          v-if="opt.action === '回复'"
          class="opt-cell"
          :key="i"
        >
          <template #title>
            <div class="opt">
              <div class="opt__user">
                <div class="user">
                  <van-image
                    class="user__avatar"
                    width="24px"
                    height="24px"
                    fit="cover"
                    round
                    :src="opt.operator.avatar"
                  />
                  <div class="user__name">
                    <div class="van-ellipsis">
                      {{ opt.operator.nickName }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="opt__datetime">
                {{ formatDatetime(opt.created_at) }}
              </div>
            </div>
          </template>
          <template #label>
            <span class="highlight">回复：</span>{{ opt.detail.content }}
          </template>
        </van-cell>
      </template>
    </van-cell-group>
    <div class="submit-bar">
      <van-grid
        clickable
        :column-num="4"
      >
        <van-grid-item
          clickable
          text="回复"
          @click="$router.push({ name: 'proposals-id-replay', params: { id: $route.params.id } })"
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
import { HelperMixin } from '@/mixins';

export default {
  mixins: [HelperMixin],
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
    align-items: center;

    &__avatar {
      flex-shrink: 0;
      margin-right: 4px;
    }
    &__name {
      overflow: hidden;
    }

    &--right {
      justify-content: flex-end;
    }
  }

  .highlight {
    color: #1989fa;
  }

  .opt {
    display: flex;
    justify-content: space-between;

    &__user {
      flex: 1;
      overflow: hidden;
    }

    &__datetime {
      flex-shrink: 0;
      color: #969799;
    }
  }

  .opt-cell {
    &::v-deep {
      .van-cell__title {
        width: 100%;
      }

      .van-cell__label {
        margin-top: 10px;
        font-size: 14px;
        line-height: 24px;
      }
    }
  }

  .content-cell {
    &::v-deep {
      .van-cell__label {
        margin-top: 10px;
        font-size: 14px;
        line-height: 24px;
      }
    }
  }
</style>

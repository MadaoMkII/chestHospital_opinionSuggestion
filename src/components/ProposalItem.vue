<template>
  <router-link
    v-if="value"
    tag="div"
    :to="to"
    class="proposal-item van-hairline--top-bottom"
  >
    <div class="proposal-item__top">
      <div class="proposal-item__title">
        {{ value.subject }}
      </div>
      <van-icon
        v-if="hasMore"
        @click.prevent="$emit('click-more')"
        class="proposal-item__more"
        name="ellipsis"
      />
    </div>
    <div class="proposal-item__bottom">
      <div class="proposal-item__bottom__left">
        <van-tag
          v-if="value.type === '意见'"
          plain
          class="proposal-item__type"
          type="primary"
        >
          意见
        </van-tag>
        <van-tag
          v-if="value.type === '建议'"
          plain
          class="proposal-item__type"
          type="success"
        >
          建议
        </van-tag>
        <div class="proposal-item__datetime">
          {{ formatDatetime(value.createdAt) }}
        </div>
      </div>
      <div class="proposal-item__status">
        {{ value.status }}
      </div>
    </div>
  </router-link>
</template>

<script>
import { HelperMixin } from '@/mixins';

export default {
  mixins: [HelperMixin],
  props: {
    value: {
      type: Object,
      required: true,
    },
    to: {
      type: [String, Object],
      required: true,
    },
    hasMore: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
  .proposal-item {
    display: block;
    background-color: #fff;
    padding: 10px 12px;

    &:active {
      background-color: #f2f3f5;
    }

    &__title {
      flex-grow: 1;
      font-size: 14px;
      line-height: 18px;
      color: #323233;
      min-height: 24px;
      display: flex;
      align-items: center;
      overflow: hidden;
      word-break: break-word;
    }
    &__top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      &__left {
        display: flex;
        align-items: flex-end;
      }
    }
    &__datetime {
      flex-shrink: 0;
      font-size: 12px;
    }
    &__status {
      flex-shrink: 0;
      font-size: 12px;
    }
    &__type {
      flex-shrink: 0;
      margin-right: 12px;
    }
  }
</style>

<template>
  <div>
    <router-view />
    <van-tabbar
      route
      safe-area-inset-bottom
    >
      <van-tabbar-item
        :to="{ name: 'index' }"
        icon="todo-list-o"
      >
        处理
      </van-tabbar-item>
      <van-tabbar-item
        :to="{ name: 'publish' }"
        icon="add-o"
      >
        发布
      </van-tabbar-item>
      <van-tabbar-item
        v-if="user.privileges.hasPrivilege_opinionSuggestion_chart || user.privileges.hasPrivilege_opinionSuggestion_front_unionAdministrate"
        :to="{ name: 'statistics' }"
        icon="bar-chart-o"
      >
        统计图
      </van-tabbar-item>
      <van-tabbar-item
        :to="{ name: 'my' }"
        icon="user-o"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
};
</script>

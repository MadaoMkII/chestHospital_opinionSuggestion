<template>
  <page-layout style="margin-top: 54px;">
    <template #header>
      <van-search
        v-model="keywords"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @clear="onSearch"
      />
    </template>
    <template #body>
      <van-tabs
        class="custom-tabs"
        v-model="tab"
        color="#1989fa"
        sticky
        :offset-top="54"
        @change="onTabChange"
        @click="onTabClick"
      >
        <van-tab
          v-if="isUnionAdministrator"
          title="全部"
          name="全部"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
            >
              <proposal-item
                v-for="item in list"
                :key="item.uuid"
                :value="{ subject: item.title, status: item.status, type: item.type, createdAt: item.created_at }"
                :to="{ name: 'proposals-id', params: { id: item.uuid } }"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
        <van-tab
          v-if="isUnionAdministrator"
          title="未处理"
          name="未处理"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
            >
              <proposal-item
                v-for="item in list"
                :key="item.uuid"
                :value="{ subject: item.title, status: item.status, type: item.type, createdAt: item.created_at }"
                :to="{ name: 'proposals-id', params: { id: item.uuid } }"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
        <van-tab
          title="处理中"
          name="处理中"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
            >
              <proposal-item
                v-for="item in list"
                :key="item.uuid"
                :value="{ subject: item.title, status: item.status, type: item.type, createdAt: item.created_at }"
                :to="{ name: 'proposals-id', params: { id: item.uuid } }"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
        <van-tab
          v-if="isApprovalLeader"
          title="待审批"
          name="已处理待审批"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
            >
              <proposal-item
                v-for="item in list"
                :key="item.uuid"
                :value="{ subject: item.title, status: item.status, type: item.type, createdAt: item.created_at }"
                :to="{ name: 'proposals-id', params: { id: item.uuid } }"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
        <van-tab
          title="协作中"
          name="协作中"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
            >
              <proposal-item
                v-for="item in list"
                :key="item.uuid"
                :value="{ subject: item.title, status: item.status, type: item.type, createdAt: item.created_at }"
                :to="{ name: 'proposals-id', params: { id: item.uuid } }"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
        <van-tab
          title="已完成"
          name="已完成"
        >
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoad"
            >
              <proposal-item
                v-for="item in list"
                :key="item.uuid"
                :value="{ subject: item.title, status: item.status, type: item.type, createdAt: item.created_at }"
                :to="{ name: 'proposals-id', params: { id: item.uuid } }"
              />
            </van-list>
          </van-pull-refresh>
          <van-empty
            v-if="total === 0 && isDirty"
            description="暂无数据"
          />
        </van-tab>
      </van-tabs>
    </template>
  </page-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      list: [],
      page: 1,
      total: 0,
      loading: false,
      finished: false,
      refreshing: false,
      isDirty: false,
      tab: '全部',
      keywords: '',
      isApprovalLeader: false,
    };
  },
  computed: {
    ...mapState(['user']),
    isUnionAdministrator() {
      return this.user.privileges.hasPrivilege_opinionSuggestion_front_unionAdministrate;
    },
  },
  async created() {
    if (this.$route.query.keywords) {
      this.keywords = this.$route.query.keywords;
    }
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    const approvalLeaderList = await this.fetchApprovalLeaderList();
    this.isApprovalLeader = !!approvalLeaderList.find((user) => this.user.USERID === user.USERID);
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.keywords) {
      this.keywords = to.query.keywords;
    }
    if (to.query.tab) {
      this.tab = to.query.tab;
    } else {
      this.tab = '全部';
    }
    next();
  },
  methods: {
    async fetchApprovalLeaderList() {
      const response = await this.$axios.get('/api/management/getApartmentManagement');
      const list = response.data.data;
      return list.filter((department) => department.dean).map((department) => department.dean);
    },
    // 加载指定参数的待评价列表
    async fetchList(params) {
      const response = await this.$axios.post('/api/opinionSuggestion/getOpinionSuggestionList', params);
      return {
        data: response.data.data,
        total: response.data.totalCount,
      };
    },
    // 滚动到底部加载数据
    async onLoad() {
      const { data, total } = await this.fetchList({
        unit: 15,
        page: this.page,
        status: this.tab,
        title: this.keywords ? this.keywords : undefined,
      });
      if (this.refreshing) {
        this.list = data;
        this.refreshing = false;
      } else {
        this.list.push(...data);
      }
      this.total = total;
      this.page += 1;
      this.loading = false;
      if (this.list.length === this.total) {
        this.finished = true;
      }
      this.isDirty = true;
    },
    // 下拉刷新
    onRefresh() {
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.$router.push({
        name: 'index',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          tab: this.tab,
        },
      }).catch(() => {});
      this.onLoad();
    },
    // 搜索数据加载
    onSearch() {
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.isDirty = false;
      this.$router.push({
        name: 'index',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          tab: this.tab,
        },
      }).catch(() => {});
      this.onLoad();
    },
    onTabChange() {
      this.list = [];
      this.page = 1;
      this.loading = true;
      this.finished = false;
      this.isDirty = false;
      setTimeout(() => {
        this.onLoad();
      }, 500);
    },
    onTabClick() {
      this.$router.push({
        name: 'index',
        query: {
          keywords: this.keywords ? this.keywords : undefined,
          tab: this.tab,
        },
      }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-tabs {
    &::v-deep {
      .van-sticky--fixed {
        z-index: 1;
      }
    }
  }
</style>

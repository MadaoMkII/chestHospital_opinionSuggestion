<template>
  <div
    v-if="proposal"
    :class="{ 'has-submit-bar': isUnionAdministratorStatus || isPrincipalStatus || isApprovalLeaderStatus || isCollaboratorStatus || isPublisherStatus }"
  >
    <van-nav-bar
      title="意见建议"
      left-text="返回"
      left-arrow
      @click-left="routerBack()"
      fixed
      placeholder
    />
    <!--    <pre>-->
    <!--      isUnionAdministrator: {{ isUnionAdministrator }}-->
    <!--      isPrincipal: {{ isPrincipal }}-->
    <!--      isApprovalLeader: {{ isApprovalLeader }}-->
    <!--      isCollaborator: {{ isCollaborator }}-->
    <!--    </pre>-->
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
        :border="false"
      >
        <template #label>
          {{ proposal.content }}
          <div
            v-if="proposal.accessories && proposal.accessories.length > 0 && accessToken"
            style="margin-top: 10px;"
          >
            <list-uploaded-files
              :access-token="accessToken"
              :data="proposal.accessories"
            />
          </div>
        </template>
      </van-cell>
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
            <div
              v-if="opt.detail.accessories && opt.detail.accessories.length > 0 && accessToken"
              style="margin-top: 10px;"
            >
              <list-uploaded-files
                :access-token="accessToken"
                :data="opt.detail.accessories"
              />
            </div>
          </template>
        </van-cell>
        <van-cell
          v-else-if="opt.action === '协同'"
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
            <span
              v-if="!opt.detail.length"
              class="highlight"
            >移除了所有协作人</span>
            <div
              v-else
              class="user-list"
            >
              <span class="highlight">设置协作人：</span>
              <div
                class="user"
                v-for="user in opt.detail"
                :key="user.USERID"
              >
                <van-image
                  class="user__avatar"
                  width="18px"
                  height="18px"
                  fit="cover"
                  round
                  :src="user.avatar"
                />
                <div class="user__name">
                  <div class="van-ellipsis">
                    {{ user.nickName }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell
          v-else-if="opt.action === '指派'"
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
            <div class="user-list">
              <span class="highlight">指派给：</span>
              <div class="user">
                <van-image
                  class="user__avatar"
                  width="18px"
                  height="18px"
                  fit="cover"
                  round
                  :src="opt.detail.avatar"
                />
                <div class="user__name">
                  <div class="van-ellipsis">
                    {{ opt.detail.nickName }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
        <van-cell
          v-else-if="opt.action === '退回'"
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
            <div class="user-list">
              <template v-if="opt.detail">
                <span class="highlight">取消指派：</span>
                <div class="user">
                  <van-image
                    class="user__avatar"
                    width="18px"
                    height="18px"
                    fit="cover"
                    round
                    :src="opt.detail.avatar"
                  />
                  <div class="user__name">
                    <div class="van-ellipsis">
                      {{ opt.detail.nickName }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <span class="highlight">退回指派</span>
              </template>
            </div>
          </template>
        </van-cell>
        <van-cell
          v-else-if="opt.action === '处理'"
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
            <span class="highlight">将状态改为已处理，等待审批</span>
          </template>
        </van-cell>
        <van-cell
          v-else-if="opt.action === '审批'"
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
            <span class="highlight">{{ opt.detail.content }}审批</span>
          </template>
        </van-cell>
        <van-cell
          v-else
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
            <div class="user-list">
              <pre>
                {{ opt }}
              </pre>
            </div>
          </template>
        </van-cell>
      </template>
    </van-cell-group>
    <!-- 我是审批领导时的操作选项-->
    <div
      v-if="isApprovalLeaderStatus"
      class="submit-bar"
    >
      <template v-if="proposal.status === '已处理待审批'">
        <van-grid
          clickable
          :column-num="3"
        >
          <van-grid-item
            clickable
            text="回复"
            @click="$router.push({ name: 'proposals-id-replay', params: { id: $route.params.id } })"
          />
          <van-grid-item
            clickable
            text="审批不通过"
            @click="setApproval(false)"
          />
          <van-grid-item
            clickable
            text="审批通过"
            @click="setApproval(true)"
          />
        </van-grid>
      </template>
    </div>
    <!-- 我是审批领导时的操作选项结束-->
    <!-- 工会管理员的操作选项 -->
    <div
      v-else-if="isUnionAdministratorStatus"
      class="submit-bar"
    >
      <template v-if="proposal.status === '未处理'">
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
            v-if="!proposal.principal"
            clickable
            text="指派"
            @click="$router.push({ name: 'proposals-id-set-principal-department-id', params: { id: $route.params.id, departmentId: '1' } })"
          />
          <van-grid-item
            v-else
            clickable
            text="退回"
            @click="deletePrincipal()"
          />
          <van-grid-item
            clickable
            text="协作"
            @click="$router.push({ name: 'proposals-id-cooperation-user-list-department-id', params: { id: $route.params.id, departmentId: '1' } })"
          />
          <van-grid-item
            clickable
            text="删除"
            @click="deleteProposal()"
          />
        </van-grid>
      </template>
      <template v-else-if="proposal.status === '处理中'">
        <van-grid
          clickable
          :column-num="isPrincipal ? 4 : 3"
        >
          <van-grid-item
            clickable
            text="回复"
            @click="$router.push({ name: 'proposals-id-replay', params: { id: $route.params.id } })"
          />
          <van-grid-item
            v-if="!proposal.principal"
            clickable
            text="指派"
            @click="$router.push({ name: 'proposals-id-set-principal-department-id', params: { id: $route.params.id, departmentId: '1' } })"
          />
          <van-grid-item
            v-else
            clickable
            text="退回"
            @click="deletePrincipal()"
          />
          <van-grid-item
            clickable
            text="协作"
            @click="$router.push({ name: 'proposals-id-cooperation-user-list-department-id', params: { id: $route.params.id, departmentId: '1' } })"
          />
          <van-grid-item
            v-if="isPrincipal"
            clickable
            text="处理"
            @click="setPending()"
          />
        </van-grid>
      </template>
      <template v-else-if="proposal.status === '已处理待审批'">
        <van-grid
          clickable
          :column-num="1"
        >
          <van-grid-item
            clickable
            text="回复"
            @click="$router.push({ name: 'proposals-id-replay', params: { id: $route.params.id } })"
          />
        </van-grid>
      </template>
    </div>
    <!-- 工会管理员的操作选项结束 -->
    <!-- 我是负责人时的操作选项 -->
    <div
      v-else-if="isPrincipalStatus"
      class="submit-bar"
    >
      <template v-if="proposal.status === '处理中'">
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
            text="退回"
            @click="deletePrincipal()"
          />
          <van-grid-item
            clickable
            text="协作"
            @click="$router.push({ name: 'proposals-id-cooperation-user-list-department-id', params: { id: $route.params.id, departmentId: '1' } })"
          />
          <van-grid-item
            clickable
            text="处理"
            @click="setPending()"
          />
        </van-grid>
      </template>
      <template v-else-if="proposal.status === '已处理待审批'">
        <van-grid
          clickable
          :column-num="1"
        >
          <van-grid-item
            clickable
            text="回复"
            @click="$router.push({ name: 'proposals-id-replay', params: { id: $route.params.id } })"
          />
        </van-grid>
      </template>
    </div>
    <!-- 我是负责人时的操作选项结束 -->
    <!-- 我是协作人时的操作选项 -->
    <div
      v-else-if="isCollaboratorStatus"
      class="submit-bar"
    >
      <template v-if="proposal.status === '处理中' || proposal.status === '已处理待审批'">
        <van-grid
          clickable
          :column-num="1"
        >
          <van-grid-item
            clickable
            text="回复"
            @click="$router.push({ name: 'proposals-id-replay', params: { id: $route.params.id } })"
          />
        </van-grid>
      </template>
    </div>
    <!-- 我是协作人时的操作选项结束 -->
    <!-- 我是发布人 -->
    <div
      v-else-if="isPublisherStatus"
      class="submit-bar"
    >
      <template v-if="proposal.status === '未处理'">
        <van-grid
          clickable
          :column-num="1"
        >
          <van-grid-item
            clickable
            text="删除"
            @click="deleteProposal()"
          />
        </van-grid>
      </template>
    </div>
    <!-- 我是发布人结束 -->
  </div>
</template>

<script>
import { HelperMixin } from '@/mixins';
import { mapState } from 'vuex';

export default {
  mixins: [HelperMixin],
  data() {
    return {
      isLoading: false,
      proposal: null,
      fromRouteName: null,
      accessToken: '',
    };
  },
  computed: {
    ...mapState(['user']),
    isPrincipal() {
      return this.proposal.principal !== undefined && this.proposal.principal.USERID === this.user.USERID;
    },
    isPrincipalStatus() {
      return this.isPrincipal && (this.proposal.status === '处理中' || this.proposal.status === '已处理待审批');
    },
    isUnionAdministrator() {
      return this.user.privileges.hasPrivilege_opinionSuggestion_front_unionAdministrate;
    },
    isUnionAdministratorStatus() {
      return this.isUnionAdministrator && (this.proposal.status === '未处理' || this.proposal.status === '处理中' || this.proposal.status === '已处理待审批');
    },
    isApprovalLeader() {
      return this.proposal.dean !== undefined && this.proposal.dean.USERID === this.user.USERID;
    },
    isApprovalLeaderStatus() {
      return this.isApprovalLeader && (this.proposal.status === '已处理待审批');
    },
    isCollaborator() {
      return this.proposal.assistant !== undefined && this.proposal.assistant.findIndex((user) => user.USERID === this.user.USERID) !== -1;
    },
    isCollaboratorStatus() {
      return this.isCollaborator && (this.proposal.status === '处理中' || this.proposal.status === '已处理待审批');
    },
    isPublisher() {
      return this.user.USERID === this.proposal.creator.USERID;
    },
    isPublisherStatus() {
      return this.isPublisher && (this.proposal.status === '未处理');
    },
  },
  async created() {
    this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
    this.accessToken = (await this.$axios.get('/api/user/getToken')).data.data;
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line no-param-reassign
      vm.fromRouteName = from.name;
    });
  },
  methods: {
    routerBack() {
      if (this.fromRouteName) {
        this.$router.back();
      } else {
        this.$router.replace({ name: 'index' });
      }
    },
    async fetchProposal(params) {
      const response = await this.$axios.post('/api/opinionSuggestion/getOpinionSuggestionDetail', params);
      return response.data.data;
    },
    async deletePrincipal() {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/opinionSuggestion/rejectOpinionSuggestion', {
          uuid: this.$route.params.id,
        });
        this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
        this.$notify({ type: 'success', message: '取消指派负责人成功' });
      } catch (e) {
        if (e.response.data && e.response.data.message) {
          this.$notify({ type: 'danger', message: e.response.data.message });
        } else {
          this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    async deleteProposal() {
      if (this.isLoading) return;
      this.$dialog.confirm({
        title: '提示',
        message: '确认要删除吗?',
      })
        .then(async () => {
          try {
            this.isLoading = true;
            await this.$axios.post('/api/opinionSuggestion/deleteOpinionSuggestion', {
              uuid: this.$route.params.id,
            });
            // this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
            this.$notify({ type: 'success', message: '删除成功' });
            this.$router.back();
          } catch (e) {
            if (e.response.data && e.response.data.message) {
              this.$notify({ type: 'danger', message: e.response.data.message });
            } else {
              this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
            }
          } finally {
            this.isLoading = false;
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    async setPending() {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/opinionSuggestion/handleOpinionSuggestion', {
          uuid: this.$route.params.id,
        });
        this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
        this.$notify({ type: 'success', message: '处理成功' });
      } catch (e) {
        if (e.response.data && e.response.data.message) {
          this.$notify({ type: 'danger', message: e.response.data.message });
        } else {
          this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
        }
      } finally {
        this.isLoading = false;
      }
    },
    async setApproval(is) {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/opinionSuggestion/approveOpinionSuggestion', {
          uuid: this.$route.params.id,
          decision: is ? '通过' : '未通过',
        });
        this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
        this.$notify({ type: 'success', message: `审批${is ? '通过' : '不通过'}成功` });
      } catch (e) {
        if (e.response.data && e.response.data.message) {
          this.$notify({ type: 'danger', message: e.response.data.message });
        } else {
          this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .user-list {
    display: inline-flex;
    flex-wrap: wrap;

    .user {
      margin-right: 8px;
    }
  }
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

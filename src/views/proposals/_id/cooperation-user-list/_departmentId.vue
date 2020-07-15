<template>
  <div>
    <van-nav-bar
      :title="currentDepartment ? currentDepartment.name : ''"
      left-text="返回"
      right-text="确定"
      left-arrow
      @click-left="back()"
      @click-right="confirm()"
      fixed
      placeholder
    />
    <van-cell-group
      v-if="departmentList.length > 0"
      title="部门"
    >
      <van-cell
        v-for="department in departmentList"
        :key="department.id"
        :title="department.name"
        is-link
        @click="next(department.id)"
      />
    </van-cell-group>
    <van-cell-group
      v-if="userList.length > 0"
      title="成员"
    >
      <van-cell
        clickable
        title="全选"
        @click="toggleSelectAll"
      >
        <template #right-icon>
          <van-checkbox :value="isSelectAll" />
        </template>
      </van-cell>
      <van-cell
        v-for="user in userList"
        :key="user.userid"
        :title="user.name"
        clickable
        @click="user.isSelected = !user.isSelected"
      >
        <template #icon>
          <van-image
            round
            width="24"
            height="24"
            :src="user.avatar"
            style="margin-right: 16px;"
          />
        </template>
        <template #right-icon>
          <van-checkbox v-model="user.isSelected" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty
      v-if="departmentList.length === 0 && userList.length === 0 && isDirty"
      description="暂无数据"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isLoading: false,
      proposal: null,
      fullDepartmentList: [],
      fullUserList: [],
      isDirty: false,
      deep: 1,
    };
  },
  computed: {
    departmentList() {
      return this.getDepartmentListByParentId(this.$route.params.departmentId);
    },
    userList() {
      return this.getUserListByDepartmentId(this.$route.params.departmentId);
    },
    isSelectAll() {
      return this.userList.every((user) => user.isSelected);
    },
    currentDepartment() {
      return this.fullDepartmentList.find((department) => department.id === parseInt(this.$route.params.departmentId, 10));
    },
    ...mapState(['cooperationUserList']),
  },
  async created() {
    await this.fetchData();
    this.isDirty = true;
  },
  methods: {
    async fetchProposal(params) {
      const response = await this.$axios.post('/api/opinionSuggestion/getOpinionSuggestionDetail', params);
      return response.data.data;
    },
    async fetchDepartmentList(accessToken) {
      return (await this.$axios.get('/wx-api/cgi-bin/department/list', {
        params: {
          access_token: accessToken,
        },
      })).data.department;
    },
    async fetchUserList(accessToken, rootDepartmentId) {
      const userList = (await this.$axios.get('/wx-api/cgi-bin/user/list', {
        params: {
          access_token: accessToken,
          department_id: rootDepartmentId,
          fetch_child: 1,
        },
      })).data.userlist;
      for (let i = 0; i < userList.length; i += 1) {
        userList[i].isSelected = false;
      }
      return userList;
    },
    async fetchData() {
      this.proposal = await this.fetchProposal({ uuid: this.$route.params.id });
      const accessToken = (await this.$axios.get('/api/user/getToken')).data.data;
      this.fullDepartmentList = await this.fetchDepartmentList(accessToken);
      const rootDepartment = this.fullDepartmentList.find((department) => department.parentid === 0);
      this.fullUserList = await this.fetchUserList(accessToken, rootDepartment.id);
      if (this.proposal.assistant) {
        for (let i = 0; i < this.proposal.assistant.length; i += 1) {
          for (let j = 0; j < this.fullUserList.length; j += 1) {
            if (this.proposal.assistant[i].USERID === this.fullUserList[j].userid) {
              this.fullUserList[j].isSelected = true;
            }
          }
        }
      }
    },
    getDepartmentListByParentId(id) {
      const list = [];
      for (let i = 0; i < this.fullDepartmentList.length; i += 1) {
        const department = this.fullDepartmentList[i];
        if (department.parentid === parseInt(id, 10)) {
          list.push(department);
        }
      }
      return list;
    },
    getUserListByDepartmentId(id) {
      const list = [];
      for (let i = 0; i < this.fullUserList.length; i += 1) {
        const user = this.fullUserList[i];
        if (user.department.includes(parseInt(id, 10))) {
          list.push(user);
        }
      }
      return list;
    },
    back() {
      this.deep -= 1;
      this.$router.back();
    },
    next(departmentId) {
      this.deep += 1;
      this.$router.push({ name: 'proposals-id-cooperation-user-list-department-id', params: { id: this.$route.params.id, departmentId } });
    },
    async confirm() {
      const userIds = this.fullUserList.filter((user) => user.isSelected).map((user) => user.userid);
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/opinionSuggestion/designateAssistant', {
          uuid: this.$route.params.id,
          assistantUSERIDArray: userIds,
        });
        this.$notify({ type: 'success', message: '设置协作成员成功' });
        this.$router.go(-this.deep);
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
    toggleSelectAll() {
      if (this.isSelectAll) {
        this.userList.map((user) => {
          Object.assign(user, { isSelected: false });
          return user;
        });
      } else {
        this.userList.map((user) => {
          Object.assign(user, { isSelected: true });
          return user;
        });
      }
    },
  },
};
</script>

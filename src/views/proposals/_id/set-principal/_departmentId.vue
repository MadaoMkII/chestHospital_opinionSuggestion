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
    <van-radio-group
      v-if="userList.length > 0"
      v-model="selectedUserId"
    >
      <van-cell-group
        title="成员"
      >
        <van-cell
          v-for="user in userList"
          :key="user.userid"
          :title="user.name"
          clickable
          @click="selectedUserId = user.userid"
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
            <van-radio :name="user.userid" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
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
      selectedUserId: null,
    };
  },
  computed: {
    departmentList() {
      return this.getDepartmentListByParentId(this.$route.params.departmentId);
    },
    userList() {
      return this.getUserListByDepartmentId(this.$route.params.departmentId);
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
      const accessToken = (await this.$axios.get('/api/user/getToken', {
        params: {
          appName: 'addressBook',
        },
      })).data.data;
      this.fullDepartmentList = await this.fetchDepartmentList(accessToken);
      const rootDepartment = this.fullDepartmentList.find((department) => department.parentid === 0);
      this.fullUserList = await this.fetchUserList(accessToken, rootDepartment.id);
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
      this.selectedUserId = null;
    },
    next(departmentId) {
      this.deep += 1;
      this.$router.push({ name: 'proposals-id-set-principal-department-id', params: { id: this.$route.params.id, departmentId } });
      this.selectedUserId = null;
    },
    async confirm() {
      if (!this.selectedUserId) {
        this.$notify({ type: 'danger', message: '请选择要指派负责人' });
        return;
      }
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/opinionSuggestion/designatePrincipal', {
          uuid: this.$route.params.id,
          principalUSERID: this.selectedUserId,
          apartmentID: `${this.currentDepartment.id}`,
        });
        this.$notify({ type: 'success', message: '指派负责人成功' });
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
  },
};
</script>

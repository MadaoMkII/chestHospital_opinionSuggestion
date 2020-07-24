import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/plugins/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    cooperationUserList: [],
    strict: true,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setCooperationUserList(state, userList) {
      state.cooperationUserList = userList;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      const response = await axios.get('/api/user/getUserInfo');
      commit('setUser', response.data.data);
    },
  },
  modules: {
  },
});

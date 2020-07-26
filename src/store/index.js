import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/plugins/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    cooperationUserList: [],
    config: null,
    strict: true,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setConfig(state, config) {
      state.config = config;
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
    async fetchConfig({ commit }) {
      const response = await axios.get('/api/system/getSystemArgs', {
        params: {
          agentName: process.env.VUE_APP_CONFIG_NAME,
        },
      });
      commit('setConfig', response.data.data);
    },
  },
  modules: {
  },
});

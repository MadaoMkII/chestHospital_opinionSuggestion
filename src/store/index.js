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
    async sync() {
      try {
        await axios.get('/api/systemSetting/synchronizeUserList');
        // eslint-disable-next-line no-empty
      } catch {}
      try {
        await axios.get('/api/systemSetting/synchronizationApartmentManagement');
        // eslint-disable-next-line no-empty
      } catch {}
    },
  },
  modules: {
  },
});

import Vue from 'vue';
import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.defaults.headers.common['Wechat-Agent-Id'] = process.env.VUE_APP_WECHAT_AGENT_ID;

Vue.prototype.$axios = axiosInstance;

export default axiosInstance;

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./assets/css/global.less";
import "./assets/font/iconfont.css";
// 配置请求基准路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/";
// 配置前端项目部署路径，地图需要使用到，就统一在这里配置
export const mapURL = "http://localhost:8889";
/**
 * localhost：本地服务器，不经过网卡传输的，它不受网络防火墙和网卡相关的限制
 *	127.0.0.1：本机地址是域名访问，通过网卡传输的，依赖网卡，并受到网络防火墙和网卡相关的限制。
 */

// 将axios挂载到Vue的原型对象上
Vue.prototype.$http = axios;

// 将全局的echarts对象挂载到vue的原型对象上
Vue.prototype.$echarts = window.echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

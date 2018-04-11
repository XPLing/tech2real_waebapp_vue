// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'; // 转义es6的API，如promise
import Vue from 'vue';
import App from 'components/index/index';
import router from 'router';
import 'assets/scss/common.scss';
import 'font-awesome/scss/font-awesome.scss';
import fastclick from 'fastclick';
import { VeeValidate, Veeconfig } from 'assets/js/validate';
import store from 'store';
import * as filters from 'assets/js/filters';

fastclick.attach(document.body); // 解决移动端click事件300毫秒的延迟

Vue.config.productionTip = false;

Vue.use(VeeValidate, Veeconfig);

// 注册全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

// 也可以使用$mount挂载根实例
// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app');

import axios from 'axios';
import { REQUEST_PREFIX } from './config';

const debug = process.env.NODE_ENV === 'development';

// if (!debug) {
//   axios.defaults.baseURL = REQUEST_PREFIX;
// }

const whiteList = '/getProductAppSetup|/api/getProductAppSetup';
export let pending = []; //  声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken;
export let removePending = (config, obj) => {
  for (let p in obj) {
    var reg = new RegExp(config.url);
    if (obj[p].u === config.url + '&' + config.method && !reg.test(whiteList) && !(config.privateConfig && config.privateConfig.concurrent)) { // 当当前请求在数组中存在时执行函数体
      obj[p].f(); //  执行取消操作
      obj.splice(p, 1); //  把这条记录从数组中移除
    }
  }
};

//  添加请求拦截器
axios.interceptors.request.use(config => {
  removePending(config, pending); // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new CancelToken((c) => {
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    pending.push({u: config.url + '&' + config.method, f: c});
    if (config.privateConfig && config.privateConfig.cancelSource) {
      config.privateConfig.cancelSource.cancel = c;
    }
  });
  return config;
}, error => {
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(res => {
  removePending(res.config, pending); // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
  return res;
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;

      case 401:
        err.message = '未授权，请登录';
        break;

      case 403:
        err.message = '拒绝访问';
        break;

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`;
        break;

      case 408:
        err.message = '请求超时';
        break;

      case 500:
        err.message = '服务器内部错误';
        break;

      case 501:
        err.message = '服务未实现';
        break;

      case 502:
        err.message = '网关错误';
        break;

      case 503:
        err.message = '服务不可用';
        break;

      case 504:
        err.message = '网关超时';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }
  }
  // console.log(err.response);
  console.log(err.message);
  var errRes = {
    code: err.response ? err.response.status : err.response,
    message: err.message
  };
  if (err.__CANCEL__) {
    errRes.isCancel = true;
  }
  return Promise.reject(errRes); // 返回一个空对象，主要是防止控制台报错

});

export default axios;

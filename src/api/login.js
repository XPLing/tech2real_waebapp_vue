/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, removePending } from './config';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';
let pending = []; //  声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken;

//  添加请求拦截器
axios.interceptors.request.use(config => {
  removePending(config, pending); // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new CancelToken((c) => {
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    pending.push({u: config.url + '&' + config.method, f: c});
  });
  return config;
}, error => {
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(res => {
  removePending(res.config, pending); // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
  return res;
}, error => {
  if (error) {
    console.log(error);
  }
  return {data: {}}; // 返回一个空对象，主要是防止控制台报错
});

export function webLoginByPhone (params) {
  var url = debug ? 'open/webLoginByPhone' : '/webLoginByPhone';
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}
export function registerByPhone (params) {
  var url = debug ? 'open/registerByPhone' : '/registerByPhone';
  const data = Object.assign({}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';
const debug = process.env.NODE_ENV === 'development';

export function getPrivileged (params) {
  var url = debug ? '/api/getPrivileged' : `${REQUEST_PREFIX}/getPrivileged`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function resetUserPassWord (params) {
  var url = debug ? '/api/resetUserPassWord' : `${REQUEST_PREFIX}/resetUserPassWord`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, removePending } from './config';
import axios from 'api/axios';
const debug = process.env.NODE_ENV !== 'production';
export function webLoginByPhone (params) {
  var url = debug ? 'open/webLoginByPhon' : '/webLoginByPhone';
  //  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'get',
    params: params
  }).then((res) => {
    console.log(res);
    return Promise.resolve(res.data);
  }, (error) => {
    return Promise.reject(error);
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
  }, (error) => {
    return Promise.reject(error);
  });
}

export function authRegisterByPhone (params) {
  var url = debug ? 'open/authRegisterByPhone' : '/authRegisterByPhone';
  const data = Object.assign({}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (error) => {
    return Promise.reject(error);
  });
}

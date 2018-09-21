/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV !== 'production';


export function getWxJsApiConfig (params) {
  var url = debug ? '/api/wxJsApi/getWxJsApiConfig' : `/wxJsApi/getWxJsApiConfig`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function wechatPay (params) {
  var url = debug ? '/api/wxJsApi/wechatPay' : `/wxJsApi/wechatPay`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function wxPayH5 (params) {
  var url = debug ? '/api/h5/wechatPay' : `/h5/wechatPay`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function listInfoCollectionsByGuid (params) {
  var url = debug ? '/api/listInfoCollectionsByGuid' : `/listInfoCollectionsByGuid`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data)
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

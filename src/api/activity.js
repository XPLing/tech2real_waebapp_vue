/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function listActivities (params) {
  var url = debug ? '/api/listActivities' : `${REQUEST_PREFIX}/listActivities`;
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
export function getActivityById (params) {
  var url = debug ? '/api/getActivityById' : `${REQUEST_PREFIX}/getActivityById`;
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
export function listDiscoverArticles (params) {
  var url = debug ? '/api/listDiscoverArticles' : `${REQUEST_PREFIX}/listDiscoverArticles`;
  const data = Object.assign({}, commonParams, params);
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
export function listDiscoverActivities (params) {
  var url = debug ? '/api/listDiscoverActivities' : `${REQUEST_PREFIX}/listDiscoverActivities`;
  const data = Object.assign({}, commonParams, params);
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
export function listDiscoverContent (params) {
  var url = debug ? '/api/listDiscoverContent' : `${REQUEST_PREFIX}/listDiscoverContent`;
  const data = Object.assign({}, commonParams, params);
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
export function listDiscoverClubs (params) {
  var url = debug ? '/api/listDiscoverClubs' : `${REQUEST_PREFIX}/listDiscoverClubs`;
  const data = Object.assign({}, commonParams, params);
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
export function applyActivity (params) {
  var url = debug ? '/api/applyActivity' : `${REQUEST_PREFIX}/applyActivity`;
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
export function getApplyByActivityId (params) {
  var url = debug ? '/api/getApplyByActivityId' : `${REQUEST_PREFIX}/getApplyByActivityId`;
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
export function cancelActivityApply (params) {
  var url = debug ? '/api/cancelActivityApply' : `${REQUEST_PREFIX}/cancelActivityApply`;
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

/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function checkUnreadNotify (params, other) {
  var url = debug ? '/api/checkUnreadNotify' : `${REQUEST_PREFIX}/checkUnreadNotify`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    data: data,
    privateConfig: other
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    return Promise.reject(err);
  });
}
export function getUserInfoByGuid (params) {
  var url = debug ? '/api/getUserInfoByGuid' : `${REQUEST_PREFIX}/getUserInfoByGuid`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    return Promise.reject(err);
  });
}
export function listFavoriteArticles (params) {
  var url = debug ? '/api/listFavoriteArticles' : `${REQUEST_PREFIX}/listFavoriteArticles`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    return Promise.reject(err);
  });
}
export function listMyActivities (params) {
  var url = debug ? '/api/listMyActivities' : `${REQUEST_PREFIX}/listMyActivities`;
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
export function listMyClubReplies (params) {
  var url = debug ? '/api/listMyClubReplies' : `${REQUEST_PREFIX}/listMyClubReplies`;
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
export function listMyClubComments (params) {
  var url = debug ? '/api/listMyClubComments' : `${REQUEST_PREFIX}/listMyClubComments`;
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
export function listNotifiesByType (params, other) {
  var url = debug ? '/api/listNotifiesByType' : `${REQUEST_PREFIX}/listNotifiesByType`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    privateConfig: other
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function clickNotifyMessage (params, other) {
  var url = debug ? '/api/clickNotifyMessage' : `${REQUEST_PREFIX}/clickNotifyMessage`;
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

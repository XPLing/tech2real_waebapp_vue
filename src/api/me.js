/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV !== 'production';

export function checkUnreadNotify (params) {
  var url = debug ? '/api/checkUnreadNotify' : `/checkUnreadNotify`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    data: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    return Promise.reject(err);
  });
}
export function getUserInfoByGuid (params) {
  var url = debug ? '/api/getUserInfoByGuid' : `/getUserInfoByGuid`;
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
  var url = debug ? '/api/listFavoriteArticles' : `/listFavoriteArticles`;
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
  var url = debug ? '/api/listMyActivities' : `/listMyActivities`;
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
  var url = debug ? '/api/listMyClubReplies' : `/listMyClubReplies`;
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
  var url = debug ? '/api/listMyClubComments' : `/listMyClubComments`;
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
export function listNotifiesByType (params) {
  var url = debug ? '/api/listNotifiesByType' : `/listNotifiesByType`;
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

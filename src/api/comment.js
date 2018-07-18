/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';

export function listCommentsByTargetId (params) {
  var url = debug ? '/api/listCommentsByTargetId' : `/listCommentsByTargetId`;
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

export function listRepliesByCommentId (params) {
  var url = debug ? '/api/listRepliesByCommentId' : `/listRepliesByCommentId`;
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

export function getCommentById (params) {
  var url = debug ? '/api/getCommentById' : `/getCommentById`;
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

export function addCommentV2 (params) {
  var url = debug ? '/api/addCommentV2' : `/addCommentV2`;
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

export function addCommentReply (params) {
  var url = debug ? '/api/addCommentReply ' : `/addCommentReply `;
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

export function likeCommentV2 (params) {
  var url = debug ? '/api/likeCommentV2 ' : `/likeCommentV2 `;
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
export function deleteCommentV2 (params) {
  var url = debug ? '/api/deleteCommentV2 ' : `/deleteCommentV2 `;
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

export function listRecommendArticles (params) {
  var url = debug ? '/api/listRecommendArticles' : `${REQUEST_PREFIX}/listRecommendArticles`;
  const data = Object.assign({}, {}, params);
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

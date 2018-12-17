/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV !== 'production';

export function getCourseById (params) {
  var url = debug ? '/api/getCourseByIdV2' : `/getCourseByIdV2`;
  params.version = 3;
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

export function listChaptersByCourseId (params) {
  var url = debug ? '/api/listChaptersByCourseId' : `/listChaptersByCourseId`;
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

export function applyCourse (params) {
  var url = debug ? '/api/applyCourseV2' : `/applyCourseV2`;
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

export function cancelOpenCourseApplyByApplyId (params) {
  var url = debug ? '/api/cancelOpenCourseApplyByApplyId' : `/cancelOpenCourseApplyByApplyId`;
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

export function getCourseApplyByCourseId (params) {
  var url = debug ? '/api/getCourseApplyByCourseId' : `/getCourseApplyByCourseId`;
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

export function getUnpaidCourseApply (params) {
  var url = debug ? '/api/getUnpaidCourseApply' : `/getUnpaidCourseApply`;
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

export function listEvaluatesByTargetId (params) {
  var url = debug ? '/api/listEvaluatesByTargetId' : `/listEvaluatesByTargetId`;
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

export function addEvaluate (params) {
  var url = debug ? '/api/addEvaluate' : `/addEvaluate`;
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

export function listCourseValidityPeriodByCourseId (params) {
  var url = debug ? '/api/listCourseValidityPeriodByCourseId' : `/listCourseValidityPeriodByCourseId`;
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

/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function getCoursePackageDetail (params) {
  var url = debug ? '/api/open/coursePackage/getCoursePackageDetail' : `${REQUEST_PREFIX}/open/coursePackage/getCoursePackageDetail`;
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
export function getCoursePackageApplyByPackageId (params) {
  var url = debug ? '/api/open/coursePackageApply/getCoursePackageApplyByPackageId' : `${REQUEST_PREFIX}/open/coursePackageApply/getCoursePackageApplyByPackageId`;
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
export function getCoursePackageById (params) {
  var url = debug ? '/api/open/coursePackage/getCoursePackageById' : `${REQUEST_PREFIX}/open/coursePackage/getCoursePackageById`;
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
export function cancelCoursePackageApplyByApplyId (params) {
  var url = debug ? '/api/open/coursePackageApply/cancelCoursePackageApplyByApplyId' : `${REQUEST_PREFIX}/open/coursePackageApply/cancelCoursePackageApplyByApplyId`;
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
export function listCoursePackage (params) {
  var url = debug ? '/api/open/coursePackage/listCoursePackage' : `${REQUEST_PREFIX}/open/coursePackage/listCoursePackage`;
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
export function listRecommendCoursePackage (params) {
  var url = debug ? '/api/open/coursePackage/listRecommendCoursePackage' : `${REQUEST_PREFIX}/open/coursePackage/listRecommendCoursePackage`;
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
export function listValidityPeriodByPackageId (params) {
  var url = debug ? '/api/open/coursePackage/listValidityPeriodByPackageId' : `${REQUEST_PREFIX}/open/coursePackage/listValidityPeriodByPackageId`;
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
export function applyCoursePackage (params) {
  var url = debug ? '/api/open/coursePackageApply/applyCoursePackage' : `${REQUEST_PREFIX}/open/coursePackageApply/applyCoursePackage`;
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

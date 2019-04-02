/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function getTagByTagId (params) {
  var url = debug ? '/api/getTagByTagId' : `${REQUEST_PREFIX}/getTagByTagId`;
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

export function listCoursesForYouWant (params) {
  var url = debug ? '/api/listCoursesForYouWant' : `${REQUEST_PREFIX}/listCoursesForYouWant`;
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

export function listMyCourses (params, cancelSource) {
  var url = debug ? '/api/listMyCourses' : `${REQUEST_PREFIX}/listMyCourses`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    privateConfig: {
      cancelSource: cancelSource
    }
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    return Promise.reject(err);
  });

}

export function getTrainHomeContainer (params) {
  var url = debug ? '/api/getTrainHomeContainer' : `${REQUEST_PREFIX}/getTrainHomeContainer`;
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

export function listRecommendTeachers (params) {
  var url = debug ? '/api/listRecommendTeachers' : `${REQUEST_PREFIX}/listRecommendTeachers`;
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

export function listBannersByLocationType (params) {
  var url = debug ? '/api/listBannersByLocationType' : `${REQUEST_PREFIX}/listBannersByLocationType`;
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

export function listRecommendCourses (params, privateConfig) {
  var url = debug ? '/api/listRecommendCourses' : `${REQUEST_PREFIX}/listRecommendCourses`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    privateConfig: privateConfig
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

export function listCourses (params, privateConfig) {
  var url = debug ? '/api/listCourses' : `${REQUEST_PREFIX}/listCourses`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: JSON.stringify(data),
    privateConfig: privateConfig
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

export function listCoursesByTagId (params) {
  var url = debug ? '/api/listCoursesByTagId' : `${REQUEST_PREFIX}/listCoursesByTagId`;
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

export function listTagContainers (params) {
  var url = debug ? '/api/listTagContainers' : `${REQUEST_PREFIX}/listTagContainers`;
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

export function listCoursesByTeacherId (params) {
  var url = debug ? '/api/listCoursesByTeacherId' : `${REQUEST_PREFIX}/listCoursesByTeacherId`;
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

export function getTeacherById (params) {
  var url = debug ? '/api/getTeacherById' : `${REQUEST_PREFIX}/getTeacherById`;
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

export function listTeachers (params) {
  var url = debug ? '/api/listTeachers' : `${REQUEST_PREFIX}/listTeachers`;
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



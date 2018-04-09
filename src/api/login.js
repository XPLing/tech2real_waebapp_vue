/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, removePending, REQUEST_PREFIX } from './config';
import axios from 'api/axios';

const debug = process.env.NODE_ENV !== 'production';

export function webLoginByPhone (params) {
  var url = debug ? 'open/webLoginByPhone' : `${REQUEST_PREFIX}/webLoginByPhone`;
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

export function registerByPhone (params) {
  var url = debug ? 'open/registerByPhone' : `${REQUEST_PREFIX}/registerByPhone`;
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
  var url = debug ? 'open/authRegisterByPhone' : `${REQUEST_PREFIX}/authRegisterByPhone`;
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

export function boundMobileVerify (params) {
  var url = debug ? 'open/boundMobileVerify' : `${REQUEST_PREFIX}/boundMobileVerify`;
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

export function webBoundMobileByThirdPartUid (params) {
  var url = debug ? 'open/webBoundMobileByThirdPartUid' : `${REQUEST_PREFIX}/webBoundMobileByThirdPartUid`;
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

export function webRegisterAndBoundMobileByThirdPartUid (params) {
  var url = debug ? 'open/webRegisterAndBoundMobileByThirdPartUid' : `${REQUEST_PREFIX}/webRegisterAndBoundMobileByThirdPartUid`;
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

export function getResetPwdAuthCode (params) {
  var url = debug ? 'open/getResetPwdAuthCode' : `${REQUEST_PREFIX}/getResetPwdAuthCode`;
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

export function resetPwdByAuthCode (params) {
  var url = debug ? 'open/resetPwdByAuthCode' : `${REQUEST_PREFIX}/resetPwdByAuthCode`;
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

export function webLoginByThirdPartCode (params) {
  var url = debug ? 'open/webLoginByThirdPartCode' : `${REQUEST_PREFIX}/webLoginByThirdPartCode`;
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

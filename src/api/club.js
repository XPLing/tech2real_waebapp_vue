/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function getClubByClubGuid (params, other) {
  var url = debug ? '/api/getClubByClubGuid' : `${REQUEST_PREFIX}/getClubByClubGuid`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data,
    privateConfig: other
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function listArticlesByClubGuid (params) {
  var url = debug ? '/api/listArticlesByClubGuid' : `${REQUEST_PREFIX}/listArticlesByClubGuid`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function quitClub (params) {
  var url = debug ? '/api/quitClub' : `${REQUEST_PREFIX}/quitClub`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function signPublicClubInView (params) {
  var url = debug ? '/api/signPublicClub' : `${REQUEST_PREFIX}/signPublicClub`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function listClub (params) {
  var url = debug ? '/api/listClub' : `${REQUEST_PREFIX}/listClub`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}
export function listMyClubs (params) {
  var url = debug ? '/api/listMyClubs' : `${REQUEST_PREFIX}/listMyClubs`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'post',
    data: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

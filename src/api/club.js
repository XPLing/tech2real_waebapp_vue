/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV !== 'production';

export function getClubByClubGuid (params) {
  var url = debug ? '/api/getClubByClubGuid' : `/getClubByClubGuid`;
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
export function listArticlesByClubGuid (params) {
  var url = debug ? '/api/listArticlesByClubGuid' : `/listArticlesByClubGuid`;
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
  var url = debug ? '/api/quitClub' : `/quitClub`;
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
  var url = debug ? '/api/signPublicClubInView' : `/signPublicClubInView`;
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
  var url = debug ? '/api/listClub' : `/listClub`;
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
  var url = debug ? '/api/listMyClubs' : `/listMyClubs`;
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

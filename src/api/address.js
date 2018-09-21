import jsonp from 'assets/js/jsonp';
import { commonParams, options, removePending, REQUEST_PREFIX } from './config';
import axios from 'api/axios';

const debug = process.env.NODE_ENV !== 'production';

export function getProvinces (params) {
  var url = debug ? '/api/getProvinces' : `/getProvinces`;
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
export function getCities (params) {
  var url = debug ? '/api/getCities' : `/getCities`;
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

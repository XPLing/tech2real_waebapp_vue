/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';

export function webLoginByPhone (params) {
  var url = debug ? 'open/webLoginByPhone' : '/webLoginByPhone';
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'get',
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // },
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  });
}

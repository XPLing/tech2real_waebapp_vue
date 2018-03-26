/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';

export function getCourseData (params) {
  var url = debug ? '/api/getCourseDetail' : '/getCourseDetail';
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
  });
}

/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';

export function addFeedback (params) {
  var url = debug ? '/api/addFeedback' : `/addFeedback`;
  // const data = Object.assign({}, commonParams, params);
  const data = params;
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

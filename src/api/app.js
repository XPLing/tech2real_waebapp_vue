import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function getProductAppSetup (params) {
  var url = debug ? '/api/getProductAppSetup' : `${REQUEST_PREFIX}/getProductAppSetup`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'GET',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

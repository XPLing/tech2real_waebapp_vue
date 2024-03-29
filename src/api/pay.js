/**
 * Created by XPL on 2018/3/20.
 */
import { commonParams, options, REQUEST_PREFIX } from './config';
import axios from './axios';

const debug = process.env.NODE_ENV === 'development';

export function getWxJsApiConfig (params, other) {
  var url = debug ? '/api/wxJsApi/getWxJsApiConfig' : `${REQUEST_PREFIX}/wxJsApi/getWxJsApiConfig`;
  const data = Object.assign({}, commonParams, params);
  return axios({
    url: url,
    method: 'get',
    params: data,
    privateConfig: other
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

export function wechatPay (params) {
  var url = debug ? '/api/wxJsApi/wechatPay' : `${REQUEST_PREFIX}/wxJsApi/wechatPay`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

export function getOrderSuc (params) {
  var url = debug ? '/api/h5/getOrderSuc' : `${REQUEST_PREFIX}/h5/getOrderSuc`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

export function wxPayH5 (params) {
  var url = debug ? '/api/h5/wechatPay' : `${REQUEST_PREFIX}/h5/wechatPay`;
  const data = Object.assign({}, {}, params);
  return axios({
    url: url,
    method: 'get',
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }, (err) => {
    return Promise.reject(err);
  });
}

export function generateAlipayPaymentInfoV2 (params) {
  var url = debug ? '/api/generateAlipayPaymentInfoV2' : `${REQUEST_PREFIX}/generateAlipayPaymentInfoV2`;
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

export function alipay (params) {
  httpPost('https://mapi.alipay.com/gateway.do', params);
  function httpPost (URL, PARAMS) {
    var temp = document.createElement('form');
    temp.action = URL;
    temp.method = 'get';
    temp.style.display = 'none';
    for (var x in PARAMS) {
      var opt = document.createElement('textarea');
      opt.name = x;
      opt.value = PARAMS[x];
      temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    document.body.removeChild(temp);
    return temp;
  }

  // console.log(params);
  // var url = 'https://mapi.alipay.com/gateway.do';
  // return axios({
  //   url: url,
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   data: qs.stringify(params)
  // }).then((res) => {
  //   return Promise.resolve(res.data);
  // }, (err) => {
  //   return Promise.reject(err);
  // });
}

export function getAlipayConfig (params) {
  var url = debug ? '/api/h5/alipay' : `${REQUEST_PREFIX}/h5/alipay`;
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

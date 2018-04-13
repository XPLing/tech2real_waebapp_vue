/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('./axios_modules');
var config = require('../../config');
var bodyParser = require('body-parser');
var queryString = require('querystring');
const urlencodedParser = bodyParser.urlencoded({extended: true});
const jsonParser = bodyParser.json();

/* 课程详情 */
apiRouter.post('/getCourseDetail', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getCourseDetail`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': 'http://localhost:8181',
      'host': 'localhost:8181'
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/applyCourse', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/applyCourse`;
  axios({
    method: 'post',
    url: url,
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});


/* 登录注册 */
apiRouter.get('/webLoginByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webLoginByPhone`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/registerByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/registerByPhone`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/authRegisterByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/authRegisterByPhone`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/boundMobileVerify', function (req, res) {
  var url = `${config.dev.apiproxy_open}/boundMobileVerify`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/webRegisterAndBoundMobileByThirdPartUid', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webRegisterAndBoundMobileByThirdPartUid`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

apiRouter.get('/webBoundMobileByThirdPartUid', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webBoundMobileByThirdPartUid`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/getResetPwdAuthCode', function (req, res) {
  var url = `${config.dev.apiproxy_open}/getResetPwdAuthCode`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/resetPwdByAuthCode', function (req, res) {
  var url = `${config.dev.apiproxy_open}/resetPwdByAuthCode`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/webLoginByThirdPartCode', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webLoginByThirdPartCode`;
  axios({
    method: 'get',
    url: url,
    headers: {
      host: 'https://open.dev.tech2real.com',
      referer: 'https://open.dev.tech2real.com/register_page'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (error) => {
    res.json(error);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

module.exports = apiRouter;

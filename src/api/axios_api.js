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
    res.json({
      code: e.response.status,
      message: e.message
    });
  });
});

apiRouter.get('/webLoginByPhone', function (req, res) {
  var url = `${config.dev.apiproxy_open}/webLoginByPhone`;
  axios({
    method: 'get',
    url: url,
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
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
    res.json({
      code: e.response.status,
      message: e.message
    });
  });
});

module.exports = apiRouter;

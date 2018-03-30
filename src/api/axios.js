/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('axios');
var config = require('../../config');
var bodyParser = require('body-parser');
var queryString = require('querystring');
const urlencodedParser = bodyParser.urlencoded({extended: true});
const jsonParser = bodyParser.json();

apiRouter.get('/getCourseDetail', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getCourseDetail`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
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
  }).catch((e) => {
    console.log(e);
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
  }).catch((e) => {
    console.log(e);
  });
});

module.exports = apiRouter;

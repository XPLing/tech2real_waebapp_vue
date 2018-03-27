/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('axios');
var config = require('../../config');

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

module.exports = apiRouter;

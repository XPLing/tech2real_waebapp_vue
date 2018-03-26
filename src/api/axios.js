/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('axios');
var config = require('../../config');
apiRouter.get('/getCourseDetail', function (req, res) {
  var url = `${config.dev.apiproxy}/getCourseDetail`;
  console.log(req);
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

module.exports = apiRouter;

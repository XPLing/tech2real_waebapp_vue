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

/* 培训 */
apiRouter.post('/listNewsCategories', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listNewsCategories`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listNewsArticlesByCategory', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listNewsArticlesByCategory`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listCommentsByTargetId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listCommentsByTargetId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.get('/getArticleById', function (req, res) {
  var url = `${config.dev.apiproxy_open}/getArticleById`;
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
apiRouter.get('/getClubByClubGuid', function (req, res) {
  var url = `${config.dev.apiproxy_open}/getClubByClubGuid`;
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
apiRouter.get('/listRecommendArticles', function (req, res) {
  var url = `${config.dev.apiproxy_open}/listRecommendArticles`;
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
/* 意见反馈 */
apiRouter.post('/addFeedback', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/addFeedback`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});

/* 培训 */
apiRouter.post('/getTagByTagId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTagByTagId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getTrainHomeContainer', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTrainHomeContainer`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listRecommendTeachers', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listRecommendTeachers`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listBannersByLocationType', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listBannersByLocationType`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listRecommendCourses', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listRecommendCourses`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listCoursesByTagId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listCoursesByTagId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getTagByTagId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTagByTagId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listTagContainers', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listTagContainers`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listCoursesByTeacherId', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listCoursesByTeacherId`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/getTeacherById', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getTeacherById`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
apiRouter.post('/listTeachers', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/listTeachers`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
    },
    data: req.body
  }).then((response) => {
    res.json(response.data);
  }, (e) => {
    console.log(e);
    res.json(e);
  });
});
/* 课程详情 */
apiRouter.post('/getCourseDetail', jsonParser, function (req, res) {
  var url = `${config.dev.apiproxy}/getCourseDetail`;
  axios({
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'referer': config.dev.apiproxy,
      'host': config.dev.apiproxyhost
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

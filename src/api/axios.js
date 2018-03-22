/**
 * Created by XPL on 2018/3/21.
 */
var express = require('express');
var apiRouter = express.Router();
var axios = require('axios');
var config = require('../../config');
apiRouter.get('/course_detail_page', function (req, res) {
    var url = `${config.dev.apiproxy}/course_detail_page_test`;
    axios({
        method: 'get',
        url: url,
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e);
    });
})

module.exports = apiRouter;

/**
 * Created by XPL on 2018/3/20.
 */
import jsonp from 'assets/js/jsonp';
import {commonParams, options} from './config';
import axios from 'axios';
const debug = process.env.NODE_ENV !== 'production';

export function getCourseData(params) {
    var url = debug ? '/api/course_detail_page' : '/course_detail_page';
    const data = Object.assign({}, commonParams, params);
    return axios({
        url: url,
        method: 'get',
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}

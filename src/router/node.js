import Vue from 'vue';
import VueRouter from 'vue-router';
import { routerPrefix, getUserGuid } from 'assets/js/util';
// import Info from 'components/info/info';
// import Train from 'components/train/train';
// import TrainDetail from 'components/train-detail/train-detail';
// import TrainDetailIntro from 'components/train-detail/intro/course-intro';
// import TrainDetailChapters from 'components/train-detail/chapters/course-chapters';
// import TrainDetailEvaluate from 'components/train-detail/evaluate/course-evaluate';
// import TrainDetailCommunity from 'components/train-detail/community/course-community';
// import Community from 'components/community/community';
// import Activity from 'components/activity/activity';
// import Me from 'components/me/me';
// import Login from 'components/user/login/login';
// import User from 'components/user/user';
// import Register from 'components/user/register/register';
// import BackPW from 'components/user/backpw/backpw';
// import MobileBind from 'components/user/mobilebind/mobilebind';

const Info = () => import(/* webpackChunkName: "info" */ 'components/info/info');
const Train = () => import(/* webpackChunkName: "train" */ 'components/train/train');
const TrainDetail = () => import(/* webpackChunkName: "trainDetail" */ 'components/train-detail/train-detail');
// const Train = resolve => {
//   // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
//   // （代码分块）
//   require.ensure([], () => {
//     resolve(require('components/train/train'));
//   });
// };
// const TrainDetail = r => require.ensure([], () => r(require('components/train-detail/train-detail')), 'trainDetail');
const CourseApplyResult = () => import(/* webpackChunkName: "courseApplyResult" */ 'components/courseApplyResult/courseApplyResult');
const CourseApplyInfoCollect = () => import(/* webpackChunkName: "courseApplyInfoCollect" */ 'components/courseApplyInfoCollect/courseApplyInfoCollect');
const CourseApplyPay = () => import(/* webpackChunkName: "courseApplyPay" */ 'components/courseApplyPay/courseApplyPay');
const TrainDetailIntro = () => import(/* webpackChunkName: "trainDetailIntro" */ 'components/train-detail/intro/course-intro');
const TrainDetailChapters = () => import(/* webpackChunkName: "trainDetailChapters" */ 'components/train-detail/chapters/course-chapters');
const TrainDetailEvaluate = () => import(/* webpackChunkName: "trainDetailEvaluate" */ 'components/train-detail/evaluate/course-evaluate');
const TrainDetailCommunity = () => import(/* webpackChunkName: "trainDetailCommunity" */ 'components/train-detail/community/course-community');
const Community = () => import(/* webpackChunkName: "community" */ 'components/community/community');
const Activity = () => import(/* webpackChunkName: "activity" */ 'components/activity/activity');
const Me = () => import(/* webpackChunkName: "me" */ 'components/me/me');
const Login = () => import(/* webpackChunkName: "login" */ 'components/user/login/login');
const User = () => import(/* webpackChunkName: "user" */ 'components/user/user');
const Register = () => import(/* webpackChunkName: "register" */ 'components/user/register/register');
const BackPW = () => import(/* webpackChunkName: "backPW" */ 'components/user/backpw/backpw');
const MobileBind = () => import(/* webpackChunkName: "mobileBind" */ 'components/user/mobilebind/mobilebind');
const TestC = () => import(/* webpackChunkName: "testC" */ 'components/testC/me');

Vue.use(VueRouter);
const Router = new VueRouter({
    linkActiveClass: 'active',
    mode: 'history',
    routes: [
        {
            path: routerPrefix + '/info',
            component: TestC,
            children: [
                {
                    path: 'info-detail',
                    component: TestC
                }
            ]
        },
        {
            path: '*',
            redirect: routerPrefix + '/info'
        }
    ]
});
Router.beforeEach((to, form, next) => {
    // console.log(Router.app.$options.store.state.userGuid);
    // console.log(to.matched);
    // let isLogin = Router.app.$options.store.state.userGuid;
    // if (to.matched.some((record) => record.meta.requireLogin)) {
    //   if (!isLogin) {
    //     next();
    //     Router.push({
    //       path: '/user/login'
    //     });
    //     // next();
    //   } else {
    //     next();
    //   }
    // }
    next();
});

export default Router;
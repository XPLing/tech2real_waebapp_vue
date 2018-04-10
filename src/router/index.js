import Vue from 'vue';
import Router from 'vue-router';
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
const Train = resolve => {
  // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
  // （代码分块）
  require.ensure([], () => {
    resolve(require('components/train/train'));
  });
};
const TrainDetail = r => require.ensure([], () => r(require('components/train-detail/train-detail')), 'trainDetail');
const CourseApplyResult = () => import(/* webpackChunkName: "courseApplyResult" */ 'components/courseApplyResult/courseApplyResult');
const TrainDetailIntro = r => require.ensure([], () => r(require('components/train-detail/intro/course-intro')), 'trainDetailIntro');
const TrainDetailChapters = r => require.ensure([], () => r(require('components/train-detail/chapters/course-chapters')), 'trainDetailChapters');
const TrainDetailEvaluate = r => require.ensure([], () => r(require('components/train-detail/evaluate/course-evaluate')), 'trainDetailEvaluate');
const TrainDetailCommunity = r => require.ensure([], () => r(require('components/train-detail/community/course-community')), 'trainDetailCommunity');
const Community = r => require.ensure([], () => r(require('components/community/community')), 'community');
const Activity = r => require.ensure([], () => r(require('components/activity/activity')), 'activity');
const Me = r => require.ensure([], () => r(require('components/me/me')), 'me');
const Login = r => require.ensure([], () => r(require('components/user/login/login')), 'login');
const User = r => require.ensure([], () => r(require('components/user/user')), 'user');
const Register = r => require.ensure([], () => r(require('components/user/register/register')), 'register');
const BackPW = r => require.ensure([], () => r(require('components/user/backpw/backpw')), 'backPW');
const MobileBind = r => require.ensure([], () => r(require('components/user/mobilebind/mobilebind')), 'mobileBind');


Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/info'
    },
    {
      path: '/info',
      component: Info
    },
    {
      path: '/train',
      component: Train,
      children: [
        {
          path: ':id',
          component: TrainDetail,
          children: [
            {
              path: '',
              redirect: 'intro'
            },
            {
              path: 'applyresult',
              component: CourseApplyResult
            },
            {
              path: 'intro',
              component: TrainDetailIntro
            },
            {
              path: 'evaluate',
              component: TrainDetailEvaluate
            },
            {
              path: 'community',
              component: TrainDetailCommunity
            },
            {
              path: 'chapters',
              component: TrainDetailChapters
            }
          ]
        }
      ]
    },
    {
      path: '/community',
      component: Community
    },
    {
      path: '/activity',
      component: Activity
    },
    {
      path: '/me',
      component: Me
    },
    {
      path: '/user',
      component: User,
      children: [
        {
          path: '',
          redirect: 'login'
        },
        {
          path: 'login',
          component: Login
        },
        {
          path: 'register',
          component: Register
        },
        {
          path: 'mobilebind',
          component: MobileBind
        },
        {
          path: 'backpw',
          component: BackPW
        }

      ]
    }
  ]
});

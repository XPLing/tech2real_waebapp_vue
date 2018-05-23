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
const Train = () => import(/* webpackChunkName: "train" */ 'components/study/study');
const TrainDetail = () => import(/* webpackChunkName: "trainDetail" */ 'components/train-detail/train-detail');
const TeacherDetail = () => import(/* webpackChunkName: "teacherDetail" */ 'components/teacher-detail/teacher-detail');
const TagDetail = () => import(/* webpackChunkName: "tagDetail" */ 'components/tag-detail/tag-detail');
const TagList = () => import(/* webpackChunkName: "tagList" */ 'components/taglist/taglist');
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
const FeedBack = () => import(/* webpackChunkName: "feedback" */ 'components/feedback/feedback');

Vue.use(VueRouter);
const Router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  base: '/m-web/',
  routes: [
    {
      path: '/',
      redirect: routerPrefix + '/info'
    },
    {
      path: routerPrefix + '/',
      redirect: routerPrefix + '/info'
    },
    {
      path: routerPrefix + '/feedback',
      component: FeedBack
    },
    {
      path: routerPrefix + '/info',
      component: Info
    },
    {
      path: routerPrefix + '/train',
      component: Train,
      children: [
        {
          path: ':id(\\d+)',
          component: TrainDetail,
          meta: {
            requireLogin: true
          },
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
              path: 'applyinfocollect',
              component: CourseApplyInfoCollect
            },
            {
              path: 'applypay',
              component: CourseApplyPay
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
        },
        {
          path: 'teacherdetail/:id',
          component: TeacherDetail
        },
        {
          path: 'tagdetail/:id',
          component: TagDetail
        },
        {
          path: 'taglist',
          component: TagList
        }
      ]
    },
    {
      path: routerPrefix + '/community',
      component: Community
    },
    {
      path: routerPrefix + '/activity',
      component: Activity
    },
    {
      path: routerPrefix + '/me',
      component: Me
    },
    {
      path: routerPrefix + '/user',
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
    },
    {
      path: '*',
      redirect: routerPrefix + '/info'
    }
  ]
});
Router.beforeEach((to, form, next) => {
  // console.log(Router.app.$options.store.state.userGuid);
  //  console.log(to.matched);
  //  console.log(Router.app.$options.store.state);
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

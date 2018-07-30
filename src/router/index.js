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
const InfoDetail = () => import(/* webpackChunkName: "infoDetail" */ 'components/info/detail/infoDetail');
const InfoDetailComment = () => import(/* webpackChunkName: "infoDetailComment" */ 'components/info/detail/comment/comment');
const InfoDetailCommentItem = () => import(/* webpackChunkName: "InfoDetailCommentItem" */ 'components/info/detail/comment-item/comment-item');
const InfoDetailCommentForm = () => import(/* webpackChunkName: "InfoDetailCommentForm" */ 'components/info/detail/commentForm/commentForm');
const Train = () => import(/* webpackChunkName: "train" */ 'components/study/study');
const TrainDetail = () => import(/* webpackChunkName: "trainDetail" */ 'components/train-detail/train-detail');
const TeacherDetail = () => import(/* webpackChunkName: "teacherDetail" */ 'components/teacher-detail/teacher-detail');
const TeacherList = () => import(/* webpackChunkName: "teacherList" */ 'components/teacherlist/teacherlist');
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
const ApplyResult = () => import(/* webpackChunkName: "ApplyResult" */ 'components/applyResult/applyResult');
const ApplyInfoCollect = () => import(/* webpackChunkName: "ApplyInfoCollect" */ 'components/applyInfoCollect/applyInfoCollect');
const ApplyPay = () => import(/* webpackChunkName: "ApplyPay" */ 'components/applyPay/applyPay');
const Community = () => import(/* webpackChunkName: "community" */ 'components/community/community');
const CommunityCommentItem = () => import(/* webpackChunkName: "CommunityCommentItem" */ 'components/community/comment-item/comment-item');
const CommunityCommentForm = () => import(/* webpackChunkName: "CommunityCommentForm" */ 'components/community/commentForm/commentForm');
const Activity = () => import(/* webpackChunkName: "activity" */ 'components/activity/activity');
const ActivityList = () => import(/* webpackChunkName: "ActivityList" */ 'components/activity/list/activityList');
const ActivityDetail = () => import(/* webpackChunkName: "ActivityDetail" */ 'components/activity/detail/activityDetail');
const ActivityDetailComment = () => import(/* webpackChunkName: "ActivityDetailComment" */ 'components/activity/detail/comment/comment');
const ActivityDetailCommentItem = () => import(/* webpackChunkName: "ActivityDetailCommentItem" */ 'components/activity/detail/comment-item/comment-item');
const ActivityDetailCommentForm = () => import(/* webpackChunkName: "ActivityDetailCommentForm" */ 'components/activity/detail/commentForm/commentForm');
const TicketList = () => import(/* webpackChunkName: "TicketList" */ 'components/activity/detail/ticket/ticketList');
const Me = () => import(/* webpackChunkName: "me" */ 'components/me/me');
const MyCourse = () => import(/* webpackChunkName: "MyCourse" */ 'components/me/course/myCourse');
const MyActivity = () => import(/* webpackChunkName: "MyActivity" */ 'components/me/activity/myActivity');
const MyCollection = () => import(/* webpackChunkName: "MyCollection" */ 'components/me/collection/myCollection');
const MyTopic = () => import(/* webpackChunkName: "MyTopic" */ 'components/me/topic/myTopic');
const MyClub = () => import(/* webpackChunkName: "MyClub" */ 'components/me/club/myClub');
const Login = () => import(/* webpackChunkName: "login" */ 'components/user/login/login');
const User = () => import(/* webpackChunkName: "user" */ 'components/user/user');
const Register = () => import(/* webpackChunkName: "register" */ 'components/user/register/register');
const BackPW = () => import(/* webpackChunkName: "backPW" */ 'components/user/backpw/backpw');
const MobileBind = () => import(/* webpackChunkName: "mobileBind" */ 'components/user/mobilebind/mobilebind');
const FeedBack = () => import(/* webpackChunkName: "feedback" */ 'components/feedback/feedback');
const Clubs = () => import(/* webpackChunkName: "Clubs" */ 'components/club/clubs');
const ClubDetail = () => import(/* webpackChunkName: "ClubDetail" */ 'components/club/detail/clubDetail');

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
      component: Info,
      name: 'info',
      children: [
        {
          path: 'infodetail/:articleId(\\d+)',
          component: InfoDetail,
          name: 'infoDetail',
          children: [
            {
              path: 'commentlist',
              component: InfoDetailComment,
              name: 'infoDetail_commentList',
              children: [
                {
                  path: ':commentId(\\d+)',
                  component: InfoDetailCommentItem,
                  name: 'infoDetail_commentDetail',
                  children: [
                    {
                      path: 'commentform',
                      component: InfoDetailCommentForm,
                      name: 'infoDetail_commentForm',
                      props: true
                    }
                  ]
                },
                {
                  path: 'commentform',
                  component: InfoDetailCommentForm,
                  name: 'infoDetail_commentFormRoot',
                  props: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/train',
      component: Train,
      children: [
        {
          path: ':id(\\d+)',
          component: TrainDetail,
          name: 'trainDetail',
          meta: {
            requireLogin: true
          },
          children: [
            {
              path: 'applyresult',
              name: 'trainDetailApply_applyresult',
              component: CourseApplyResult
            },
            {
              path: 'applyinfocollect/:applyTargetGuid',
              name: 'trainDetailApply_applyinfocollect',
              component: CourseApplyInfoCollect,
              props: {
                applyType: 'applyCourse'
              }
            },
            {
              path: 'applypay',
              name: 'trainDetailApply_applypay',
              component: CourseApplyPay
            }
          ]
        },
        {
          path: 'teacherdetail/:id',
          component: TeacherDetail
        },
        {
          path: 'teacherlist',
          component: TeacherList
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
      component: Community,
      children: [
        {
          path: ':commentId(\\d+)',
          component: CommunityCommentItem,
          name: 'community_commentDetail',
          children: [
            {
              path: 'commentform',
              component: CommunityCommentForm,
              name: 'community_commentForm',
              props: true
            }
          ]
        },
        {
          path: 'commentform',
          component: CommunityCommentForm,
          name: 'community_commentFormRoot',
          props: true
        }
      ]
    },
    {
      path: routerPrefix + '/activity',
      component: Activity,
      name: 'activity',
      children: [
        {
          path: 'list',
          component: ActivityList,
          children: [
            {
              path: 'detail/:id(\\d+)',
              component: ActivityDetail,
              name: 'activityDetail',
              children: [
                {
                  path: 'commentlist',
                  component: ActivityDetailComment,
                  children: [
                    {
                      path: ':commentId(\\d+)',
                      component: ActivityDetailCommentItem,
                      children: [
                        {
                          path: 'commentform',
                          component: ActivityDetailCommentForm,
                          props: true
                        }
                      ]
                    },
                    {
                      path: 'commentform',
                      component: ActivityDetailCommentForm,
                      props: true
                    }
                  ]
                },
                {
                  path: 'ticketList',
                  component: TicketList,
                  props: true,
                  name: 'activityDetail_Tickets',
                  children: [
                    {
                      path: 'applyresult',
                      component: ApplyResult,
                      name: 'activityDetail_TicketApplyResult'
                    },
                    {
                      path: ':ticketId/applyinfocollect/:applyTargetGuid',
                      component: ApplyInfoCollect,
                      name: 'activityDetail_applyInfoCollect',
                      props: {
                        applyType: 'applyActivity'
                      }
                    },
                    {
                      path: 'applypay',
                      name: 'activityDetail_applyPay',
                      component: ApplyPay
                    }
                  ]
                },
                {
                  path: 'applyresult',
                  component: ApplyResult,
                  name: 'activityDetail_ApplyResult'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: routerPrefix + '/me',
      component: Me,
      children: [
        {
          path: 'course',
          component: MyCourse
        },
        {
          path: 'activity',
          component: MyActivity
        },
        {
          path: 'collection',
          component: MyCollection
        },
        {
          path: 'topic',
          component: MyTopic
        },
        {
          path: 'club',
          component: MyClub
        }
      ]
    },
    {
      path: routerPrefix + '/clubs',
      component: Clubs,
      children: [
        {
          path: 'clubdetail/:clubguId',
          component: ClubDetail,
          name: 'clubDetail'
        }
      ]
    },
    {
      path: routerPrefix + '/user',
      component: User,
      redirect: 'login',
      name: 'user',
      children: [
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
      path: '/applyresult',
      component: ApplyResult
    },
    {
      path: '/applyinfocollect/:id(\\d+)',
      component: ApplyInfoCollect
    },
    {
      path: '/applypay',
      component: ApplyPay
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

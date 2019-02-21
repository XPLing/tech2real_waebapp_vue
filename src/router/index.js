import Vue from 'vue';
import VueRouter from 'vue-router';
import {routerPrefix, getUserGuid} from 'assets/js/util';
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
/**
 * 处理路由页面切换时，异步组件加载过渡的处理函数
 * @param {Object} AsyncView 需要加载的组件，如 import('@/components/home/Home.vue')
 * @return {Object} 返回一个promise对象
 */
function lazyLoadView(AsyncView) {
    const AsyncHandler = () => ({
        component: AsyncView,
        loading: require('base/page-loading/page-loading.vue').default,
        // 加载失败时使用的组件
        error: require('base/page-loadfail/page-loadfail.vue').default,
        delay: 200,
        timeout: 50000
    });
    return Promise.resolve({
        functional: true,
        render(h, {data, children}) {
            return h(AsyncHandler, data, children);
        }
    });
}

const Info = () => lazyLoadView(import(/* webpackChunkName: "info" */ 'components/info/info'));
const InfoDetail = () => lazyLoadView(import(/* webpackChunkName: "infoDetail" */ 'components/info/detail/infoDetail'));
const InfoDetailComment = () => lazyLoadView(import(/* webpackChunkName: "infoDetailComment" */ 'components/info/detail/comment/comment'));
const InfoDetailCommentItem = () => lazyLoadView(import(/* webpackChunkName: "InfoDetailCommentItem" */ 'components/info/detail/comment-item/comment-item'));
const InfoDetailCommentForm = () => lazyLoadView(import(/* webpackChunkName: "InfoDetailCommentForm" */ 'components/info/detail/commentForm/commentForm'));
const Train = () => lazyLoadView(import(/* webpackChunkName: "train" */ 'components/study/study'));
const TrainAll = () => lazyLoadView(import(/* webpackChunkName: "train" */ 'components/train/train'));
const TrainDetail = () => lazyLoadView(import(/* webpackChunkName: "trainDetail" */ 'components/train-detail/train-detail'));
const TrainMyCourse = () => lazyLoadView(import(/* webpackChunkName: "TrainMyCourse" */ 'components/study-subscribe/study-subscribe'));
const TrainCourseList = () => lazyLoadView(import(/* webpackChunkName: "TrainCourseList" */ 'components/train/course/courselist'));
const courseEvaluateForm = () => lazyLoadView(import(/* webpackChunkName: "courseEvaluateForm" */ 'components/train-detail/evaluateForm/evaluateForm'));
const TeacherDetail = () => lazyLoadView(import(/* webpackChunkName: "teacherDetail" */ 'components/teacher-detail/teacher-detail'));
const TeacherList = () => lazyLoadView(import(/* webpackChunkName: "teacherList" */ 'components/teacherlist/teacherlist'));
const TagDetail = () => lazyLoadView(import(/* webpackChunkName: "tagDetail" */ 'components/tag-detail/tag-detail'));
const TagList = () => lazyLoadView(import(/* webpackChunkName: "tagList" */ 'components/taglist/taglist'));
// const Train = resolve => {
//   // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
//   // （代码分块）
//   require.ensure([], () => {
//     resolve(require('components/train/train'));
//   });
// };
// const TrainDetail = r => require.ensure([], () => r(require('components/train-detail/train-detail')), 'trainDetail');
const CourseApplyResult = () => lazyLoadView(import(/* webpackChunkName: "courseApplyResult" */ 'components/courseApplyResult/courseApplyResult'));
const CourseApplyInfoCollect = () => lazyLoadView(import(/* webpackChunkName: "courseApplyInfoCollect" */ 'components/courseApplyInfoCollect/courseApplyInfoCollect'));
const CourseApplyPay = () => lazyLoadView(import(/* webpackChunkName: "courseApplyPay" */ 'components/courseApplyPay/courseApplyPay'));
const ApplyResult = () => lazyLoadView(import(/* webpackChunkName: "ApplyResult" */ 'components/applyResult/applyResult'));
const ApplyInfoCollect = () => lazyLoadView(import(/* webpackChunkName: "ApplyInfoCollect" */ 'components/applyInfoCollect/applyInfoCollect'));
const ApplyPay = () => lazyLoadView(import(/* webpackChunkName: "ApplyPay" */ 'components/applyPay/applyPay'));
const Community = () => lazyLoadView(import(/* webpackChunkName: "community" */ 'components/community/community'));
const CommunityCommentItem = () => lazyLoadView(import(/* webpackChunkName: "CommunityCommentItem" */ 'components/community/comment-item/comment-item'));
const CommunityCommentForm = () => lazyLoadView(import(/* webpackChunkName: "CommunityCommentForm" */ 'components/community/commentForm/commentForm'));
const Activity = () => lazyLoadView(import(/* webpackChunkName: "activity" */ 'components/activity/activity'));
const ActivityList = () => lazyLoadView(import(/* webpackChunkName: "ActivityList" */ 'components/activity/list/activityList'));
const ActivityDetail = () => lazyLoadView(import(/* webpackChunkName: "ActivityDetail" */ 'components/activity/detail/activityDetail'));
const ActivityDetailComment = () => lazyLoadView(import(/* webpackChunkName: "ActivityDetailComment" */ 'components/activity/detail/comment/comment'));
const ActivityDetailCommentItem = () => lazyLoadView(import(/* webpackChunkName: "ActivityDetailCommentItem" */ 'components/activity/detail/comment-item/comment-item'));
const ActivityDetailCommentForm = () => lazyLoadView(import(/* webpackChunkName: "ActivityDetailCommentForm" */ 'components/activity/detail/commentForm/commentForm'));
const TicketList = () => lazyLoadView(import(/* webpackChunkName: "TicketList" */ 'components/activity/detail/ticket/ticketList'));
const Me = () => lazyLoadView(import(/* webpackChunkName: "me" */ 'components/me/me'));
const MyInfo = () => lazyLoadView(import(/* webpackChunkName: "MyInfo" */ 'components/me/info/myInfo'));
const MyCourse = () => lazyLoadView(import(/* webpackChunkName: "MyCourse" */ 'components/me/course/myCourse'));
const MyActivity = () => lazyLoadView(import(/* webpackChunkName: "MyActivity" */ 'components/me/activity/myActivity'));
const MyCollection = () => lazyLoadView(import(/* webpackChunkName: "MyCollection" */ 'components/me/collection/myCollection'));
const MyTopic = () => lazyLoadView(import(/* webpackChunkName: "MyTopic" */ 'components/me/topic/myTopic'));
const MyClub = () => lazyLoadView(import(/* webpackChunkName: "MyClub" */ 'components/me/club/myClub'));
const MyMessage = () => lazyLoadView(import(/* webpackChunkName: "MyMessage" */ 'components/me/message/myMessage'));
const About = () => lazyLoadView(import(/* webpackChunkName: "About" */ 'components/me/about/about'));
const Protocol = () => lazyLoadView(import(/* webpackChunkName: "Protocol" */ 'components/me/protocol/protocol'));
const Setting = () => lazyLoadView(import(/* webpackChunkName: "Setting" */ 'components/me/setting/setting'));
const SettingASafety = () => lazyLoadView(import(/* webpackChunkName: "SettingASafety" */ 'components/me/setting/account/safety'));
const SettingAManage = () => lazyLoadView(import(/* webpackChunkName: "SettingAManage" */ 'components/me/setting/account/manage'));
const ResetPW = () => lazyLoadView(import(/* webpackChunkName: "ResetPW" */ 'components/me/setting/account/resetPW'));
const MyAccountBindMobile = () => lazyLoadView(import(/* webpackChunkName: "MyAccountBindMobile" */ 'components/me/setting/mobilebind/mobilebind'));
const Login = () => lazyLoadView(import(/* webpackChunkName: "login" */ 'components/user/login/login'));
const User = () => lazyLoadView(import(/* webpackChunkName: "user" */ 'components/user/user'));
const Register = () => lazyLoadView(import(/* webpackChunkName: "register" */ 'components/user/register/register'));
const BackPW = () => lazyLoadView(import(/* webpackChunkName: "backPW" */ 'components/user/backpw/backpw'));
const MobileBind = () => lazyLoadView(import(/* webpackChunkName: "mobileBind" */ 'components/user/mobilebind/mobilebind'));
const FeedBack = () => lazyLoadView(import(/* webpackChunkName: "feedback" */ 'components/feedback/feedback'));
const Clubs = () => lazyLoadView(import(/* webpackChunkName: "Clubs" */ 'components/club/clubs'));
const ClubDetail = () => lazyLoadView(import(/* webpackChunkName: "ClubDetail" */ 'components/club/detail/clubDetail'));
const payResult = () => lazyLoadView(import(/* webpackChunkName: "payResult" */ 'components/payResult/payResult'));

Vue.use(VueRouter);
const Router = new VueRouter({
    linkActiveClass: 'active',
    mode: 'history',
    base: '/m-web/',
    scrollBehavior(to, from, savePosition) { // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
        to.meta.toTop = false;
        if (savePosition) {
            return savePosition;
        } else {
            to.meta.toTop = true;
            return {x: 0, y: 0};
        }
    },
    routes: [
        {
            path: routerPrefix + '/',
            redirect: routerPrefix + '/info'
        },
        {
            path: '/feedback',
            component: FeedBack,
            name: 'rootFeedBack'
        },
        {
            path: routerPrefix + '/info',
            component: Info,
            name: 'rootInfo',
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
                            meta: {
                                isBack: false
                            },
                            children: [
                                {
                                    path: ':commentId(\\d+)',
                                    component: InfoDetailCommentItem,
                                    meta: {
                                        keepAlive: true,
                                        isBack: false
                                    },
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
                },
                {
                    path: 'infodetail/commentlist',
                    component: InfoDetailComment,
                    children: [
                        {
                            path: ':commentId(\\d+)',
                            component: InfoDetailCommentItem,
                            meta: {
                                keepAlive: true,
                                isBack: false
                            },
                            children: [
                                {
                                    name: 'infoCommentForm',
                                    path: 'commentform',
                                    component: InfoDetailCommentForm,
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
            name: 'rootTrain',
            meta: {
                keepAlive: true,
                isBack: false
            },
            children: [
                {
                    path: 'applypay',
                    alias: '/pay/courseApplypay',
                    name: 'trainCourseApplyPay',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: CourseApplyPay
                },
                {
                    path: 'all/applyresult',
                    name: 'trainDetailApply_applyresult',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: CourseApplyResult
                },
                {
                    path: 'all/:id(\\d+)',
                    component: TrainDetail,
                    name: 'trainDetail',
                    meta: {
                        requireLogin: true,
                        keepAlive: false,
                        isBack: false
                    },
                    children: [
                        {
                            path: 'evaluateForm',
                            meta: {
                                keepAlive: true,
                                isBack: false
                            },
                            component: courseEvaluateForm,
                            name: 'courseEvaluateForm'
                        },
                        {
                            path: 'applyinfocollect/:applyTargetGuid',
                            name: 'trainDetailApply_applyinfocollect',
                            component: CourseApplyInfoCollect,
                            meta: {
                                keepAlive: true,
                                isBack: false
                            },
                            props: {
                                applyType: 'applyCourse'
                            }
                        },
                        {
                            meta: {
                                keepAlive: true,
                                isBack: false
                            },
                            path: 'applypay',
                            component: CourseApplyPay
                        }
                    ]
                },
                {
                    path: 'all/teacherdetail/:id',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: TeacherDetail,
                    name: 'teacherDetail'
                },
                {
                    path: 'all/teacherlist',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: TeacherList,
                    name: 'teacherList'
                },
                {
                    path: 'all/tagdetail/:id',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: TagDetail,
                    name: 'tagDetail'
                },
                {
                    path: 'all/taglist',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: TagList,
                    name: 'tagList'
                },
                {
                    path: 'all/courselist',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: TrainCourseList,
                    name: 'trainCourseList'
                },
                {
                    path: 'mycourse',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: TrainMyCourse,
                    name: 'trainMyCourse'
                }
            ]
        },
        {
            path: '/community',
            component: Community,
            name: 'rootCommunity',
            children: [
                {
                    path: ':commentId(\\d+)',
                    component: CommunityCommentItem,
                    name: 'community_commentDetail',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    children: [
                        {
                            path: 'commentform',
                            component: CommunityCommentForm,
                            name: 'community_commentForm',
                            props: true,
                            meta: {
                                keepAlive: true,
                                isBack: false
                            }
                        }
                    ]
                },
                {
                    path: 'commentform',
                    component: CommunityCommentForm,
                    name: 'community_commentFormRoot',
                    props: true,
                    meta: {
                        keepAlive: true,
                        isBack: false
                    }
                }
            ]
        },
        {
            path: '/activity',
            component: Activity,
            name: 'rootActivity',
            children: [
                {
                    path: 'applypay',
                    component: ApplyPay,
                    name: 'activityApplyPay',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    alias: '/pay/activityApplyPay'
                },
                {
                    path: 'detail/:id(\\d+)',
                    component: ActivityDetail,
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    name: 'activityDetail',
                    children: [
                        {
                            path: 'commentlist',
                            name: 'activityDetailComment',
                            meta: {
                                keepAlive: true,
                                isBack: false
                            },
                            component: ActivityDetailComment,
                            children: [
                                {
                                    path: ':commentId(\\d+)',
                                    name: 'activityDetailCommentItem',
                                    meta: {
                                        keepAlive: true,
                                        isBack: false
                                    },
                                    component: ActivityDetailCommentItem,
                                    children: [
                                        {
                                            path: 'commentform',
                                            name: 'activityDetailCommentForm',
                                            meta: {
                                                keepAlive: true,
                                                isBack: false
                                            },
                                            component: ActivityDetailCommentForm,
                                            props: true
                                        }
                                    ]
                                },
                                {
                                    path: 'commentform',
                                    name: 'activityCommentForm',
                                    meta: {
                                        keepAlive: true,
                                        isBack: false
                                    },
                                    component: ActivityDetailCommentForm,
                                    props: true
                                }
                            ]
                        },
                        {
                            path: 'ticketList',
                            component: TicketList,
                            props: true,
                            meta: {
                                keepAlive: false,
                                isBack: false
                            },
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
                },
                {
                    path: 'list',
                    component: ActivityList,
                    name: 'activityList',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    children: []
                },
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
                }
            ]
        },
        {
            path: '/me',
            component: Me,
            name: 'rootMe',
            children: [
                {
                    path: 'info',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: MyInfo
                },
                {
                    path: 'course',
                    name: 'meMyCourse',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: MyCourse
                },
                {
                    path: 'activity',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: MyActivity
                },
                {
                    path: 'collection',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: MyCollection
                },
                {
                    path: 'topic',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: MyTopic
                },
                {
                    path: 'club',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: MyClub
                },
                {
                    path: 'message',
                    meta: {
                        keepAlive: true,
                        isBack: false
                    },
                    component: MyMessage
                },
                {
                    path: 'about',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: About
                },
                {
                    path: 'protocol',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: Protocol
                },
                {
                    path: 'setting',
                    meta: {
                        keepAlive: false,
                        isBack: false
                    },
                    component: Setting,
                    children: [
                        {
                            path: 'safety',
                            meta: {
                                keepAlive: false,
                                isBack: false
                            },
                            component: SettingASafety,
                            children: [
                                {
                                    path: 'resetPW',
                                    meta: {
                                        keepAlive: false,
                                        isBack: false
                                    },
                                    component: ResetPW
                                },
                                {
                                    path: 'bindMobile',
                                    meta: {
                                        keepAlive: false,
                                        isBack: false
                                    },
                                    component: MyAccountBindMobile
                                }
                            ]
                        },
                        {
                            path: 'manage',
                            meta: {
                                keepAlive: false,
                                isBack: false
                            },
                            component: SettingAManage
                        }
                    ]
                }
            ]
        },
        {
            path: routerPrefix + '/clubs',
            component: Clubs,
            name: 'rootClubs',
            children: [
                {
                    path: 'clubdetail/:clubguId',
                    component: ClubDetail,
                    name: 'clubDetail'
                }
            ]
        },
        {
            path: '/user',
            component: User,
            redirect: 'login',
            name: 'rootUser',
            children: [
                {
                    path: 'login',
                    component: Login,
                    beforeEnter: (to, from, next) => {
                        console.log('zya!!!!');
                        console.log(Router.app.$options.store);
                        var store = Router.app.$options.store, toPath = to.fullPath;
                        var fromPath = from.fullPath;
                        var isUser = false;
                        for (var i = 0, len = from.matched.length; i < len; i++) {
                            var item = from.matched[i];
                            var name = item.name;
                            if (name === 'user') {
                                isUser = true;
                                break;
                            }
                        }
                        console.log(isUser);

                        if (!isUser) {
                            store.commit('UPDATA_BEFORELOGINPAGE', fromPath);
                        }
                        next();
                    }
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
            path: '/payresult',
            component: payResult
        },
        {
            path: '/applyinfocollect/:id(\\d+)',
            component: ApplyInfoCollect
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
    var u = navigator.userAgent, app = navigator.appVersion,
        isWx = u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger',
        isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS && isWx && /\/pay\//.test(to.path) && '/m-web' + to.path !== window.location.pathname) {
        window.location.assign('/m-web' + to.fullPath);
    }
    next();
});

export default Router;

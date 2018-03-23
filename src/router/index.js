import Vue from 'vue';
import Router from 'vue-router';
import Info from 'components/info/info';
import Train from 'components/train/train';
import TrainDetail from 'components/train-detail/train-detail';
import TrainDetailIntro from 'components/train-detail/intro/course-intro';
import TrainDetailChapters from 'components/train-detail/chapters/course-chapters';
import TrainDetailEvaluate from 'components/train-detail/evaluate/course-evaluate';
import TrainDetailCommunity from 'components/train-detail/community/course-community';
import Community from 'components/community/community';
import Activity from 'components/activity/activity';
import Me from 'components/me/me';
import Login from 'components/user/login/login';
import Register from 'components/user/register/register';

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
      component: Login,
      children: [
        {
          path: 'login',
          component: Login
        },
        {
          path: 'register',
          component: Register
        }
      ]
    }
  ]
});

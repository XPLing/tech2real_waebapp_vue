import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import Recommend from 'components/recommend/recommend';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
    routes: [
        {
            path: '/recommend',
            component: Recommend
        },
        {
            path: '/rank',
            component: Rank
        },
        {
            path: '/search',
            component: Search
        },
        {
            path: '/singer',
            component: Singer
        }
    ]
})

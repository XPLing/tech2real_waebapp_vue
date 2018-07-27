<template>
  <div class="g-me">
    <scroll ref="scroll" :data="userInfo">
      <div>
        <header class="g-header">
          <i class="icon c-icon-message"></i>
        </header>
        <section class="g-main">
          <div class="info-base">
            <img v-lazy="avatar"/>
            <template v-if="userGuid">
              <p class="info">{{name}}</p>
            </template>
            <template v-else>
              <router-link :to="{path:'/user/login'}" class="info">{{name}}</router-link>
            </template>
          </div>
          <div class="info-my">
            <ul class="list">
              <li class="item" v-for="(item, index) in myList" :key="index" @click="clickMy(item)">
                <div class="icon-wrapper" v-html="item.icon"></div>
                <div class="desc">
                  <p class="name">{{item.name}}</p>
                  <i class="icon c-icon-angle-right"></i>
                </div>
              </li>
            </ul>
          </div>
          <div class="info-system">
            <ul class="list">
              <li class="item" v-for="(item, index) in systemList" :key="index">
                <div class="icon-wrapper" v-html="item.icon"></div>
                <div class="desc">
                  <p class="name">{{item.name}}</p>
                  <i class="icon c-icon-angle-right"></i>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </scroll>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import { getUserInfoByGuid } from 'api/me';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '我的',
        isRouterAlive: true,
        name: '登录',
        avatar: require('assets/image/defaultAvatar.png'),
        myList: [
          {
            icon: '<span class="c-icon-my_course"><i class="path1"></i><i class="path2"></i><i class="path3"></i></span>',
            name: '我的课程',
            viewName: 'subscribe',
            title: '我的课程',
            path: 'course'
          },
          {
            icon: '<span class="c-icon-my_activity"><i class="path1"></i><i class="path2"></i></span>',
            name: '我的活动',
            viewName: 'MyActivity',
            title: '我的活动',
            path: 'activity'
          },
          {
            icon: '<span class="c-icon-my_collect"><i class="path1"></i><i class="path2"></i></span>',
            name: '我的收藏',
            viewName: 'subscribe',
            title: '我的收藏',
            path: 'collection'
          },
          {
            icon: '<span class="c-icon-my_topic"><i class="path1"></i><i class="path2"></i></span>',
            name: '我的话题',
            viewName: 'subscribe',
            title: '我的话题',
            path: 'topic'
          },
          {
            icon: '<span class="c-icon-my_clubs"><i class="path1"></i><i class="path2"></i></span>',
            name: '关注社群',
            viewName: 'subscribe',
            title: '关注社群',
            path: 'clubs'
          },
          {
            icon: '<span class="c-icon-balance"><i class="path1"></i><i class="path2"></i></span>',
            name: '我的余额',
            viewName: 'subscribe',
            title: '我的余额',
            path: 'balance'
          }
        ],
        systemList: [
          {
            icon: '<span class="c-icon-my_set"><i class="path1"></i><i class="path2"></i></span>',
            name: '设置',
            path: '/'
          },
          {
            icon: '<span class="c-icon-suggestion"><i class="path1"></i><i class="path2"></i></span>',
            name: '意见反馈',
            path: '/'
          },
          {
            icon: '<span class="c-icon-about"><i class="path1"></i><i class="path2"></i><i class="path3"></i></span>',
            name: '关于我们',
            path: '/'
          },
          {
            icon: '<span class="c-icon-my_share"><i class="path1"></i><i class="path2"></i></span>',
            name: '把硬见分享给朋友',
            path: '/'
          }
        ],
        subPageTitle: '',
        currView: ''
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid',
        'userInfo'
      ])
    },
    created () {
      if (this.userGuid) {
        this.getInfo();
      }
    },
    methods: {
      clickMy(data){
          this.$router.push({
            path: `${data.path}`,
            append: true
          });
      },
      getInfo () {
        return this._getUserInfoByGuid().then((res) => {
          if (res.status) {
            if (res.status != ERR_OK_STR) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.recordUserinfo(res.results);
            this.avatar = this.userInfo.faceUrl;
            this.name = this.userInfo.nickname;
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      _getUserInfoByGuid () {
        let params = {
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return getUserInfoByGuid(params);
      },
      ...mapMutations({
        recordUserinfo: 'RECORD_USERINFO'
      })
    },
    watch: {},
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      TopTip,
      Loading,
      Scroll,
      NoResult
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./me";

</style>

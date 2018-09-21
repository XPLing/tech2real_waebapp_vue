<template>
  <div class="g-me">
    <scroll ref="scroll" :data="userInfo">
      <div>
        <header class="g-header">
          <router-link :to="{path:'message', append: true}" tag="i" class="icon c-icon-message"></router-link>
        </header>
        <section class="g-main">
          <div class="info-base">
            <template v-if="userGuid">
              <router-link tag="img" :to="{path:'info',append:true}" v-lazy="avatar"></router-link>
              <p class="info">{{name}}</p>
            </template>
            <template v-else>
              <img v-lazy="avatar"/>
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
              <li class="item" v-for="(item, index) in systemList" :key="index" @click="clickSystem(item)">
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
    <share :no-self="true" @cancel="cancelShare" @share="share" ref="share"></share>
    <confirm ref="confirmsWrapper" :text="confirmTxt" @confirm="confirm"></confirm>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR, thirdParty } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import { getUserInfoByGuid } from 'api/me';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import Confirm from 'base/confirm/confirm';
  import Share from 'base/share/share';
  import wx from 'weixin-js-sdk';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '我的',
        isRouterAlive: true,
        avatarImg: require('assets/image/defaultAvatar.png'),
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
            path: 'club'
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
            append: true,
            type: 'link',
            path: 'setting'
          },
          {
            icon: '<span class="c-icon-suggestion"><i class="path1"></i><i class="path2"></i></span>',
            name: '意见反馈',
            append: false,
            type: 'link',
            path: '/feedback'
          },
          {
            icon: '<span class="c-icon-about"><i class="path1"></i><i class="path2"></i><i class="path3"></i></span>',
            name: '关于我们',
            type: 'link',
            append: true,
            path: 'about'
          },
          {
            icon: '<span class="c-icon-my_share"><i class="path1"></i><i class="path2"></i></span>',
            name: '把硬见分享给朋友',
            type: 'operate'
          }
        ],
        subPageTitle: '',
        currView: '',
        confirmTxt: '请先登录!'
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid',
        'userInfo'
      ]),
      avatar () {
        if (!this.userInfo) {
          return this.avatarImg;
        }
        return this.userInfo.faceUrl;
      },
      name () {
        if (!this.userInfo) {
          return '登录';
        }
        return this.userInfo.nickname;
      }
    },
    created () {
      if (this.userGuid) {
        this.getInfo();
        if (/^1.*/.test(util.common.getbrowserType())) {
//          wx.config({
//            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//            appId: thirdParty.wechat.appId, // 必填，公众号的唯一标识
//            timestamp: '', // 必填，生成签名的时间戳
//            nonceStr: '', // 必填，生成签名的随机串
//            signature: '',// 必填，签名
//            jsApiList: [] // 必填，需要使用的JS接口列表
//          });
        }
      }
    },
    methods: {
      cancelShare () {

      },
      share (data) {
        if (data < 0) {

        } else if (data === 1) {

        } else if (data === 2) {

        } else if (data === 3) {

        } else if (data === 4) {

        }
      },
      confirm () {
        this.$router.push({
          path: '/user/login'
        });
      },
      clickSystem (data) {
        if (!this.userGuid) {
          this.$refs.confirmsWrapper.show();
          return false;
        }
        if (data.type === 'link') {
          this.$router.push({
            path: data.path,
            append: data.append ? data.append : false
          });
        } else {
          this.$refs.share.show();
        }
      },
      clickMy (data) {
        if (!this.userGuid) {
          this.$refs.confirmsWrapper.show();
          return false;
        }
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
            this.updateUserInfo(res.results.user);
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
      ...mapActions([
        'updateUserInfo'
      ])
    },
    watch: {},
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      TopTip,
      Loading,
      Scroll,
      NoResult,
      Confirm,
      Share
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./me";

</style>

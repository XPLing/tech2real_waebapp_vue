<template>
  <div class="g-me">
    <scroll ref="scroll" :data="userInfo">
      <div>
        <header class="g-header">
          <router-link :to="{path:'message', append: true}" tag="i" class="icon c-icon-message"
                       :class="{'new-msg':hasNewMsg}"></router-link>
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
    <loading ref="loading" :title="loadingTxt"></loading>
    <share :no-self="true" @cancel="cancelShare" @share="share" ref="share"></share>
    <confirm ref="confirmsWrapper" :text="confirmTxt" @confirm="confirm"></confirm>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
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
  import { getUserInfoByGuid, checkUnreadNotify } from 'api/me';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import Confirm from 'base/confirm/confirm';
  import Share from 'base/share/share';
  import wx from 'weixin-js-sdk';

  export default {
    name: 'KA_rootMe',
    data () {
      return {
        hasNewMsg: false,
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
        shareInfo: null,
        loadingTxt: '',
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
        this.upDateUnreadNotify();
      }
    },
    methods: {
      showShare () {
        this.$refs.share.show();
      },
      cancelShare () {

      },
      shareError (erro) {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      },
      shareGetConfigStart () {
        this.loadingTxt = '环境初始化中...';
        this.$refs.loading.show();
      },
      shareGetConfigEnd () {
        this.$refs.loading.hide();
      },
      share (data) {
        switch (data) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
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
      upDateUnreadNotify () {
        return this._checkUnreadNotify().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return false;
            }
            this.hasNewMsg = res.result ? res.result : false;
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
      _checkUnreadNotify () {
        let params = {
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return checkUnreadNotify(params, {
          concurrent: true
        });
      },
      ...mapActions([
        'updateUserInfo'
      ])
    },
    watch: {
      $route: function (route) {
        if (route.name === 'rootMe') {
          this.upDateUnreadNotify();
        }

      }
    },
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

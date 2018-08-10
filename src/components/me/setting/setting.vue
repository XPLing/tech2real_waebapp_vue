<template>
  <transition name="slide">
    <div class="g-setting">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
            <div class="chunk account">
              <ul class="list">
                <li class="item" v-for="(item, index) in aList" :key="index" @click="clickItem(item)">
                  <p class="name">{{item.name}}</p>
                  <i class="icon fa fa-angle-right"></i>
                </li>
              </ul>
            </div>
            <div class="chunk other">
              <ul class="list">
                <li class="item" v-for="(item, index) in oList" :key="index" @click="clickItem(item)">
                  <p class="name">{{item.name}}</p>
                  <i class="icon fa fa-angle-right"></i>
                </li>
              </ul>
            </div>
            <div class="btnbox">
              <button type="button" class="btn" @click="signOutHandle">退出登录</button>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <router-view v-if="isRouterAlive"></router-view>
      <confirm :text="operateTip" ref="confirm" @confirm="confirm"></confirm>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import NoResult from 'base/no-result/no-result';

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        pageTitle: '设置',
        isRouterAlive: true,
        toptipTxt: '',
        operateTip: '',
        aList: [
          {
            name: '账号管理',
            path: 'manage'
          },
          {
            name: '账号与安全',
            path: 'safety'
          }
        ],
        oList: [
          {
            name: '消息管理',
            path: ''
          }
        ]
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])

    },
    created () {
    },
    methods: {
      confirm(){
        this.signOut();
        this.$router.back();
      },
      signOutHandle () {
        this.operateTip = '确定退出登录？';
        this.$refs.confirm.show();
      },
      clickItem (data) {
        this.$router.push({
          path: data.path,
          append: true
        });
      },
      ...mapActions([
        'signOut'
      ])
    },
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      Confirm,
      TopTip,
      Loading,
      Scroll,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./setting";
</style>

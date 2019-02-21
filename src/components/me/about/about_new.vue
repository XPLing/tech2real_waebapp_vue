<template>
  <transition name="slide">
    <div class="g-about">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
            <header class="logo">
              <img class="avatar" src="./logo.png">
              <p class="version">WAP版 v1.0.0</p>
            </header>
            <div class="base-info">
              <ul class="list">
                <li class="item">
                  <p class="name">客服电话</p>
                  <p class="cont"></p>
                </li>
                <li class="item">
                  <p class="name">邮箱</p>
                  <p class="cont"></p>
                </li>
              </ul>
            </div>
            <div class="other">
              <ul class="list">
                <li class="item" @click="toProtocol">
                  <p class="name">用户服务协议</p>
                  <i class="icon fa fa-angle-right"></i>
                </li>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <router-view v-if="isRouterAlive"></router-view>
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
  import { mapGetters, mapMutations } from 'vuex';
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
        pageTitle: '关于我们',
        isRouterAlive: true,
        toptipTxt: ''
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
      toProtocol () {
        this.$router.push({
          path: '/me/protocol'
        });
      }
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
  @import "./about";
</style>

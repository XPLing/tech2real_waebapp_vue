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
              <div class="chunk-item introbox">
                <img class="avatar" src="./logo.png">
                <p class="version">硬见</p>
                <p class="subtitle">智慧连接硬见创新</p>
                <p class="intro">
                  云创硬见是国内最具特色的电子工程师社区，融合了行业资讯、社群互动、培训学习、活动交流、设计与制造分包等服务，以开放式硬件创新技术交流和培训服务为核心，连接了超过30万工程师和产业链上下游企业，聚焦电子行业的科技创新，聚合最值得关注的产业链资源， 致力于为百万工程师和创新创业型企业打造一站式公共设计与制造服务平台。</p>
              </div>
              <div class="chunk-item cooperationbox">
                <ul class="cooperation">
                  <li class="item">
                    <p class="name">内容、培训业务合作</p>
                    <p class="email">developer@tech2real.com</p>
                  </li>
                  <li class="item">
                    <p class="name">活动、媒体、商户合作</p>
                    <p class="email">business@tech2real.com</p>
                  </li>
                </ul>
              </div>
              <div class="chunk-item copyrightbox">
                <a class="link" target="_blank" :href="linkUrl">服务条款和隐私政策</a>
                <div class="copyright">硬见 版权所有 <br> Copyright  2016-2019.<br> All Rights Reserved.</div>
              </div>
            </header>
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

  const isDev = process.env.NODE_ENV === 'development';
  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        pageTitle: '关于硬见',
        isRouterAlive: true,
        toptipTxt: ''
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ]),
      linkUrl () {
        return isDev ? 'http://m.dev.tech2real.com/html/license/license.html?product_guid=a5c72d76-16dc-4bb6-b6af-f2e562b1839b' : 'http://m.tech2real.com/html/license/license.html?product_guid=a5c72d76-16dc-4bb6-b6af-f2e562b1839b';
      }
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

<template>
  <div class="g-study">
    <header class="g-header">
      <HeaderTitleTab :title="pageTitle" @toggle-tab="toggleTab"></HeaderTitleTab>
    </header>
    <div class="g-view">
      <transition name="slide" mode="out-in">
        <keep-alive>
          <component :is="currView"></component>
        </keep-alive>
      </transition>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import HeaderTitleTab from 'components/header-title-tab/header-title-tab';
  import train from 'components/train/train';
  import subscribe from 'components/study-subscribe/study-subscribe';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';

  export default {
    data () {
      return {
        pageTitle: [
          {
            title: '培训',
            component: 'train'
          },
          {
            title: '已订',
            component: 'subscribe'
          }
        ],
        currView: 'train'
      };
    },
    mounted () {

    },
    methods: {
      toggleTab (item, index) {
         this.currView = this.pageTitle[index].component;
      }
    },
    components: {
      HeaderTitleTab,
      swiper,
      swiperSlide,
      train,
      subscribe
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./study";

</style>

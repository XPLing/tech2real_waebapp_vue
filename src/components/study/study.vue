<template>
  <div class="g-study">
    <header class="g-header">
      <HeaderTitleTab :title="pageTitle" @toggle-tab="toggleTab"></HeaderTitleTab>
    </header>
    <div class="g-view">
      <transition  name="slide" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <transition  name="slide" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import HeaderTitleTab from 'components/header-title-tab/header-title-tab';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';

  export default {
    beforeRouteEnter (to, from, next) {
      console.log(to);
      next();
    },
    data () {
      return {
        pageTitle: [
          {
            key: 'trainView',
            title: '培训',
            path: '/train/all'
          },
          {
            key: 'myCourseView',
            title: '已订',
            path: '/train/mycourse'
          }
        ],
        currView: 'train',
        viewKey: 'trainView'
      };
    },
    activated(){
    },
    mounted () {

    },
    methods: {
      toggleTab (item, index) {
        this.viewKey = item.key;
         this.$router.push({
           path: item.path
         })
      }
    },
    components: {
      HeaderTitleTab,
      swiper,
      swiperSlide
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./study";

</style>

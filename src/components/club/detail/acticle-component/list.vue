<template>
    <div class="c-article">
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="dataList" ref="scroll" :pullup="true" :probeType="probeType"
                :listenScroll="listenScroll" @pullingUp="requestSrollDate">
          <div>
            <ul class="list" v-if="dataList">
              <info-item :info="Iitem" v-for="(Iitem, Iindex) in dataList" :key="Iindex"
                         @selectInfo="selectInfo"></info-item>
            </ul>
            <div class="no-result" v-show="!dataList">
              <no-result :title="'没有找到您要的内容'"></no-result>
            </div>
            <p v-show="dataList && (requestMoreFlag || noMore)" class="request-result">
              {{noMore ? noMoreStr : noResult}}</p>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
    </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import BackTop from 'base/backtop/backtop';
  import InfoItem from 'base/info-item/info-item';

  export default {
    data () {
      return {
        dataList: null,
        toptipTxt: '',
        pageTitle: '',
        probeType: 2,
        listenScroll: true,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1
      };
    },
    created () {
    },
    computed: {
    },
    methods: {
      requestSrollDate () {
        this.$emit('requestSrollDate');
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      selectInfo(data){
        this.$emit('selectArticle', data);
      }
    },
    watch: {
      dataList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      swiper,
      swiperSlide,
      TopTip,
      Loading,
      Scroll,
      BackTop,
      NoResult,
      InfoItem
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./list";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

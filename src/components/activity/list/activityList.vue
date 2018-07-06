<template>
  <transition name="slide">
    <div class="g-activity-list">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="activityList" ref="scroll" :pullup="true" :probeType="probeType"
                :listenScroll="listenScroll" @pullingUp="requestActivity" @scroll="setScrollY">
          <div>
            <div class="list" v-if="activityList">
              <activity-list :activity-list="activityList" @selectActivity="selectActivity"></activity-list>
            </div>
            <div class="no-result" v-show="!activityList">
              <no-result :title="'没有找到您要的内容'"></no-result>
            </div>
            <p v-show="activityList && (requestMoreFlag || noMore)" class="request-result">
              {{noMore ? noMoreStr : noResult}}</p>

          </div>
        </scroll>
      </div>
      <back-top ref="backTop" @backTop="backTop"></back-top>
      <router-view :comment-form-placeholder="'请输入评论内容'" :type="'comment'" @update="update"></router-view>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
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
  import NoResult from 'base/no-result/no-result';
  import { listActivities } from 'api/activity';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import ActivityList from 'base/activity-list/activity-list';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '活动列表',
        articleInfo: null,
        probeType: 2,
        listenScroll: true,
        recommendList: null,
        activityList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        scrollY: 0
      };
    },
    created () {
      this.isUpdate = false;
      this.requestActivity();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      setScrollY(pos){
        this.scrollY = pos.y;
      },
      update () {
        this.requestPage = 1;
        this.activityList = null;
        this.noMore = false;
        this.requestMoreFlag = false;
        this.isUpdate = true;
        this.requestActivity();
      },
      selectActivity (data) {
        this.$router.push({
          path: `/activity/list/detail/${data.id}`
        });
      },
      requestActivity () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listActivities(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.activityList) {
                  this.activityList = this.activityList.concat(res.result);
                } else {
                  this.activityList = res.result;
                }
                this.requestPage = this.requestPage + 1;
              } else {
                this.noMore = true;
                this.$refs.scroll.closePullUp();
                this.$nextTick(() => {
                  this.$refs.scroll.refresh();
                });
              }
            }
          }, erro => {
            this.$refs.scroll.finishPullUp();
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      _listActivities (page) {
        var param = {
          page: page,
          userGuid: this.userGuid
        };
        return listActivities(param);
      }
    },
    watch: {
      scrollY (newVal) {
        if (newVal < -100) {
          if (!this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.showIcon();
          }
        } else {
          if (this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.hideIcon();
          }
        }
      },
      activityList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      TopTip,
      Loading,
      Scroll,
      BackTop,
      NoResult,
      ActivityList
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./activityList";


</style>

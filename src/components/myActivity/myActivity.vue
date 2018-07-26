<template>
  <div class="g-subscribe">
    <scroll ref="scroll" class="train-content" :pullup="true" :data="requestScrollDataList"
            @pullingUp="requestScrollData">
      <div>
        <div class="g-recommend course">
          <ul class="list" v-if="requestScrollDataList">
            <my-activity-item :data="item" v-for="(item, index) in requestScrollDataList" :key="index"
                              @selectItem="selectItem" @details="applyDetail"></my-activity-item>
          </ul>
          <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : noResult}}</p>
        </div>
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
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { listMyActivities } from 'api/me';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import MyActivityItem from 'base/my-activity-item/my-activity-item';
  import NoResult from 'base/no-result/no-result';

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        isRouterAlive: true,
        toptipTxt: '',
        requestScrollDataList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        first: true
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this.requestScrollData();
    },
    methods: {
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      selectItem (data) {
        this.$router.push({
          path: `/activity/list/detail/${data.id}`,
          query: {
            first: this.first
          }
        });
        if (this.first) {
          this.first = false;
        }
      },
      applyDetail (data) {
        this.$router.push({
          name: 'activityDetail_ApplyResult',
          params: {
            id: data.id
          },
          query: {
            first: this.first
          }
        });
        if (this.first) {
          this.first = false;
        }
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listMyActivities(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.requestScrollDataList) {
                  this.requestScrollDataList = this.requestScrollDataList.concat(res.result);
                } else {
                  this.requestScrollDataList = res.result;
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
      _listMyActivities (page) {
        var param = {
          limiSize: 10,
          page: page,
          version: 1,
          userGuid: this.userGuid
        };
        return listMyActivities(param);
      }
    },
    watch: {
      requestScrollDataList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
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
      MyActivityItem,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myActivity";
</style>

<template>
  <div class="g-subscribe">
    <scroll ref="scroll" class="train-content" :pullup="true" :data="requestScrollDataList"
            @pullingUp="requestScrollData">
      <div>
        <div class="g-recommend course">
          <template v-if="userGuid && requestScrollDataList">
            <ul class="list">
              <subscribe-item :subscribe-data="item" v-for="(item, index) in requestScrollDataList" :key="index"
                              @selectItem="selectItem" @details="courseDetails"></subscribe-item>
            </ul>
            <p v-show="(requestMoreFlag || noMore) || !requestScrollDataList" class="request-result">
              {{noMore || !requestScrollDataList ? noMoreStr : noResult}}</p>
          </template>
          <template v-else>
            <no-result :title="'暂无内容~~'"></no-result>
          </template>
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
  import { listMyCourses } from 'api/train';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import SubscribeItem from 'base/subscribe-item/subscribe-item';
  import NoResult from 'base/no-result/no-result';

  export default {
    name: 'studySubscribe',
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
        first: true,
        axiosSource: {}
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
    activated () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.noMore = false;
        this.requestPage = 1;
        this.requestScrollDataList = null;
        if (this.userGuid) {
          this.requestScrollData();
        } else {
          this.requestScrollDataList = null;
        }
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
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
          path: `/train/all/${data.courseId}`
        });
        if (this.first) {
          this.first = false;
        }
      },
      courseDetails (data) {
        this.$router.push({
          path: `/train/all/applyresult`,
          query: {
            applyTargetId: data.courseId,
            applyId: data.courseApplyValidityPeriod.courseApplyId
          }
        });
        if (this.first) {
          this.first = false;
        }
      },
      cancelRequest (msg) {
        this.axiosSource && this.axiosSource.cancel && this.axiosSource.cancel(msg || '取消请求');
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listMyCourses(this.requestPage).then((res) => {
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
          }).catch(erro => {
            console.log(erro);
            if (!erro.isCancel) {
              this.$refs.scroll.finishPullUp();
              this.toptipTxt = erro.message;
              this.$refs.toptip.show();
            }
          });
        }
      },
      _listMyCourses (page) {
        var param = {
          limiSize: 10,
          page: page,
          version: 1,
          userGuid: this.userGuid
        };
        return listMyCourses(param, this.axiosSource);
      }
    },
    beforeDestroy () {
      this.cancelRequest();
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
      SubscribeItem,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./study-subscribe";
</style>

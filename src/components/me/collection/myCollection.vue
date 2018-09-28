<template>
  <transition name="slide">
    <div class="g-myCollection">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll" class="train-content" :pullup="true" :data="requestScrollDataList"
                @pullingUp="requestScrollData">
          <div>
            <div class="g-recommend course">
              <ul class="list" v-if="requestScrollDataList">
                <info-item :info="item" v-for="(item, index) in requestScrollDataList" :key="index"
                           @selectInfo="selectItem"></info-item>
              </ul>
              <div class="no-result" v-show="!requestScrollDataList">
                <no-result :title="'没有找到您要的内容'"></no-result>
              </div>
              <p v-show="requestScrollDataList && (requestMoreFlag || noMore)" class="request-result">
                {{noMore ? noMoreStr : noResult}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
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
  import { listFavoriteArticles } from 'api/me';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import InfoItem from 'base/info-item/info-item';
  import NoResult from 'base/no-result/no-result';

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        pageTitle: '我的收藏',
        isRouterAlive: true,
        toptipTxt: '',
        requestScrollDataList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1
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
        this.requestScrollData();
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
          path: `/info/infodetail/${data.id}`
        });
      },
      applyDetail (data) {
        this.$router.push({
          name: 'activityDetail_ApplyResult',
          params: {
            id: data.id
          }
        });
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listFavoriteArticles(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                return Promise.reject(res);
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
          }).catch(error => {
            this.$refs.scroll.finishPullUp();
            this.toptipTxt = error.message;
            this.$refs.toptip.show();
          });
        }
      },
      _listFavoriteArticles (page) {
        var param = {
          page_size: 10,
          page: page,
          version: 1,
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return listFavoriteArticles(param);
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
      InfoItem,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myCollection";
</style>

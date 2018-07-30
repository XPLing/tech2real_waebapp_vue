<template>
  <transition name="slide">
    <div class="g-community-comment-item">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :data="community" ref="scroll">
          <div>
            <header class="toList">
              <img class="cover" src="./club1.png" >
              <div class="operate">
                <p class="text">更多精彩社群，等着你加入！</p>
                <router-link class="btn" :to="{path:'/clubs'}">去看看</router-link>
              </div>
            </header>
            <div class="titlebox green">
              <p class="icon left"><span class="small"></span><span class="big"></span></p>
              <p class="title">我的社群</p>
              <p class="icon right"><span class="big"></span><span class="small"></span></p>
            </div>
            <club-join :data="clubList" v-if="clubList" @selectItem="selectItem" @join="joinClub" :join-show-flag="false"></club-join>
            <div class="no-result" v-show="!clubList">
              <no-result :title="'没有找到您要的内容'"></no-result>
            </div>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <router-view></router-view>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @confirm="confirm"></confirm>
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
  import BackTop from 'base/backtop/backtop';
  import { listMyClubs } from 'api/club';
  import Confirm from 'base/confirm/confirm';
  import ClubJoin from 'base/club-join/club-join';
  import Mask from 'base/mask/mask';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '我的社群',
        articleInfo: null,
        probeType: 2,
        listenScroll: true,
        clubList: null,
        community: null,
        placeholder: '',
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        confirmTxt: '确定删除该话题？'
      };
    },
    created () {
      this._listMyClubs().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.clubList = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      joinClub (data) {
        if (data.isLiked === 'N') {
          this._likeCommentV2(2, data.id).then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.isLiked = 'Y';
              data.likeCount = data.likeCount + 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      deleteComment (data) {
        this.$refs.confirmsWrapper.show();
      },
      confirm () {
        this._deleteCommentV2().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.$emit('update');
            this.$router.back();
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      selectItem (data) {
        this.$router.push({
          path: `/clubs/clubdetail/${data.guid}`
        });
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listMyClubs(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.clubList) {
                  this.clubList = this.clubList.concat(res.result);
                } else {
                  this.clubList = res.result;
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
      _listMyClubs () {
        var param = {
          userGuid: this.userGuid
        };
        return listMyClubs(param);
      }
    },
    watch: {
      clubList () {
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
      Confirm,
      ClubJoin,
      'g-mask': Mask
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myClub";
</style>

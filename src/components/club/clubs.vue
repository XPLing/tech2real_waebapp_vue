<template>
  <transition name="slide">
    <div class="g-community-comment-item">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :data="community" ref="scroll">
          <div>
            <club-join :data="clubList" @selectItem="selectItem" @join="joinClub"></club-join>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <router-view @update="update"  v-if="isRouterAlive"></router-view>
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
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import BackTop from 'base/backtop/backtop';
  import { listClub, signPublicClubInView } from 'api/club';
  import Confirm from 'base/confirm/confirm';
  import ClubJoin from 'base/club-join/club-join';
  import Mask from 'base/mask/mask';

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    beforeRouteEnter (to, from, next) {
      next((vm) => {
//        if (from.name === 'activity') {
//          vm.articleId = to.params.articleId;
//          if (!to.query.first) {
//            vm.reload();
//          }
//        }
      });
    },
    data () {
      return {
        isRouterAlive: true,
        toptipTxt: '',
        pageTitle: '所有栏目',
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
      this.requestData();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      update(){
        this.requestData();
      },
      requestData(){
        this._listClub().then((res) => {
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
      joinClub (data) {
        if (data.userClubId !== 1) {
          this._signPublicClubInView(data.guid).then((res) => {
            if (res.code) {
              if (res.status !== ERR_OK_STR) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.userClubId = 1;
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
          path: `clubdetail/${data.guid}`,
          append: true
        });
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listClub(this.requestPage).then((res) => {
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
      _listClub () {
        var param = {
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return listClub(param);
      },
      _signPublicClubInView (id) {
        var param = {
          club_guid: id,
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return signPublicClubInView(param);
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
  @import "./clubs";
</style>

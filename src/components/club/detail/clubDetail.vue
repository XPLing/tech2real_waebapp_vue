<template>
  <div class="g-club-detail">
    <header class="g-header">
      <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
    </header>
    <div class="brief" v-if="clubInfo" ref="scrollTargetHeight">
      <div class="base">
        <img class="avatar" :src="clubInfo.logoUrl">
        <div class="desc">
          <p class="name">{{clubInfo.name}}</p>
          <p class="count">社群人数:{{clubInfo.memberCount}}人</p>
          <p class="btn" :class="{'joined': clubInfo.userClubId==1}" @click.stop="joinClub(clubInfo)" v-if="clubInfo.isDefault==='N'">
            <i class="icon" v-if="clubInfo.userClubId !== 1">+</i>
            <span>{{clubInfo.userClubId == 1 ? '已加入' : '加入'}}</span>
          </p>
        </div>
      </div>
      <div class="intro">简介:{{clubInfo.profile}}</div>
    </div>
    <div class="g-tag" :class="{'active':tagFloatFlag}" ref="tag" v-if="tagList">
      <div class="tag-item" v-for="(item, index) in tagList" :key="index" :class="{'active': tagCurrentIndex === index}"
           @click="changeTag(item, index)">
        {{item.name}}
      </div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <div class="g-main" ref="main">
      <scroll ref="scroll" class="train-content" :pullup="true" :data="clubInfo" :probeType="probeType"
              @pullingUp="requestScrollDate" :listenScroll="true" @scroll="scrollHandle">
        <div>
          <div class="g-info-list" v-if="infoList">
            <div class="info-type-item" v-for="(item,index) in infoList" :key="index" v-show="tagCurrentIndex===index">
              <div v-if="item.length>0">
                <ul class="list" v-if="index===0">
                  <info-item :info="Iitem" v-for="(Iitem, Iindex) in item" :key="Iindex"
                             @selectInfo="selectInfo"></info-item>

                </ul>
                <c-topic v-else :data-list="item" @selectItem="selectTopic" @like="likeTopic"></c-topic>
              </div>
              <div v-if="item.length<=0" class="no-result-wrapper">
                <no-result :title="'暂无资讯~~'"></no-result>
              </div>
              <div v-else>
                <p v-show="requestMoreFlag[index] || noMore[index]" class="request-result">
                  {{noMore[index] ? noMoreStr : noResult}}</p>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
    <back-top ref="backTop" @backTop="backTop"></back-top>
    <keep-alive>
      <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
  </div>
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
  import InfoItem from 'base/info-item/info-item';
  import NoResult from 'base/no-result/no-result';
  import { listNewsCategories, listNewsArticlesByCategory } from 'api/info';
  import { getClubByClubGuid, listArticlesByClubGuid, signPublicClubInView, quitClub } from 'api/club';
  import { listCommentsByTargetId, likeCommentV2 } from 'api/comment';
  import listBannersByLocationType from 'api/banner';
  import BackTop from 'base/backtop/backtop';
  import CTopic from 'base/club-topic/topic';

  const NAV_HEIGHT = util.common.calculateWH(40);
  const TAG_HEIGHT = util.common.calculateWH(44);
  let BANNER_HEIGHT = util.common.calculateWH(160);
  const BANNER_HEIGHT_SPLIT = util.common.calculateWH(20);
  const transform = util.common.cssPrefix('transform');

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        probeType: 3,
        toptipTxt: '',
        pageTitle: '',
        isRouterAlive: true,
        tagList: [
          {
            name: '文章'
          },
          {
            name: '话题'
          }
        ],
        tagCurrentIndex: 0,
        requestMoreFlag: [false, false],
        requestFun: ['_listArticlesByClubGuid', '_listCommentsByTargetId'],
        noMore: [false, false],
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        infoPage: [1, 1],
        infoList: [],
        scrollY: 0,
        tagFloatFlag: false,
        clubInfo: null,
        clubGuid: '',
        infoFirst: true,
        clubFirst: true,
        minY: 0
      };
    },
    created () {
      // BANNER_HEIGHT = this.$refs.innerHeight;

      this.minY = -BANNER_HEIGHT;
      this.oldTop = 0;
      this.clubGuid = this.$route.params.clubguId;
      this._getClubByClubGuid().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.clubInfo = res.result;
          this.pageTitle = res.result.name;
          this.requestScrollDate();
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
        if (data.userClubId !== 1) {
          this._signPublicClubInView(data.guid).then((res) => {
            if (res.status) {
              if (res.status !== ERR_OK_STR) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.userClubId = 1;
              this.$emit('update');
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        } else {
          this._quitClub(data.guid).then((res) => {
            if (res.status) {
              if (res.status !== ERR_OK_STR) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.userClubId = -2;
              this.$emit('update');
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      selectTopic (data) {
        var url = `/community/${data.id}`;
        this.$router.push({
          path: url,
          query: {
            first: this.clubFirst
          }
        });
        if (this.clubFirst) {
          this.clubFirst = false;
        }
      },
      likeTopic (data) {
        if (data.isLike === 'N' && !this.likeFlag) {
          this.likeFlag = true;
          this._likeCommentV2(data.id).then((res) => {
            this.likeFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.isLike = 'Y';
              data.likeCount = data.likeCount + 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      selectInfo (data) {
        var url = `/info/infodetail/${data.id}`;
        this.$router.push({
          path: url,
          query: {
            first: this.infoFirst
          }
        });
        if (this.infoFirst) {
          this.infoFirst = false;
        }
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      scrollHandle (pos) {
        this.scrollY = pos.y;
      },
      changeTag (item, index) {
        this.tagCurrentIndex = index;
        if (!this.infoList[this.tagCurrentIndex] && !this.requestMoreFlag[[this.tagCurrentIndex]]) {
          this.requestScrollDate();
        }
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
          this.$refs.scroll.scrollTo(0, 0);
          var bgLayerDom = this.$refs.bgLayer;
          var tagDom = this.$refs.tag;
          if (this.oldTop != 0) {
            bgLayerDom.style[transform] = `translate3d(0,0,0)`;
            tagDom.style[transform] = `translate3d(0,0,0)`;
          }

        });
      },
      requestScrollDate () {
        if (this.noMore[this.tagCurrentIndex]) {
          return;
        }
        if (!this.requestMoreFlag[[this.tagCurrentIndex]]) {
          this.requestMoreFlag[this.tagCurrentIndex] = true;
          this[this.requestFun[this.tagCurrentIndex]](this.infoPage[this.tagCurrentIndex]).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.$set(this.requestMoreFlag, this.tagCurrentIndex, false);
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.infoList[this.tagCurrentIndex]) {
                  this.$set(this.infoList, this.tagCurrentIndex, this.infoList[this.tagCurrentIndex].concat(res.result));
                } else {
                  this.$set(this.infoList, this.tagCurrentIndex, res.result);
                }
                this.infoPage[this.tagCurrentIndex] = this.infoPage[this.tagCurrentIndex] + 1;
              } else {
                if (!this.infoList[this.tagCurrentIndex]) {
                  this.$set(this.infoList, this.tagCurrentIndex, []);
                }
                this.$set(this.noMore, this.tagCurrentIndex, true);
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
      switching (val) {
        this.currView = val;
      },
      _getClubByClubGuid () {
        var param = {
          club_guid: this.clubGuid,
          user_guid: this.userGuid,
          product_guid: this.productGuid,
          clientType: 1
        };
        return getClubByClubGuid(param);
      },
      _listArticlesByClubGuid (page) {
        var param = {
          club_guid: this.clubGuid,
          user_guid: this.userGuid,
          product_guid: this.productGuid,
          page: page,
          page_size: 10
        };
        return listArticlesByClubGuid(param);
      },
      _listCommentsByTargetId (page) {
        var param = {
          limitSize: 10,
          page: page,
          type: 4,
          userGuid: this.userGuid,
          targetId: this.clubInfo.id,
          version: 1
        };
        return listCommentsByTargetId(param);
      },
      _likeCommentV2 (id) {
        var param = {
          isLike: 'Y',
          clientType: 1,
          type: 1,
          userGuid: this.userGuid,
          targetId: id
        };
        return likeCommentV2(param);
      },
      _quitClub (id) {
        var param = {
          club_guid: id,
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return quitClub(param);
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
      scrollY (newVal) {
        var bgLayerDom = this.$refs.bgLayer;
        var tagDom = this.$refs.tag;
        var newmainTop = newVal;
        if (newVal < 0) {
          if (newVal <= this.minY) {
            newmainTop = this.minY;
          }
        } else {
          newmainTop = 0;
        }
        if (newVal < -100) {
          if (!this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.showIcon();
          }
        } else {
          if (this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.hideIcon();
          }
        }
        if (this.oldTop !== newmainTop) {
          bgLayerDom.style[transform] = `translate3d(0,${newmainTop}px,0)`;
          tagDom.style[transform] = `translate3d(0,${newmainTop}px,0)`;
        }
        this.oldTop = newmainTop;
      },
      infoList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      clubInfo () {
        this.$nextTick(() => {
          var bgLayerDom = this.$refs.bgLayer;
          var mainDom = this.$refs.main;
          BANNER_HEIGHT = this.$refs.scrollTargetHeight.offsetHeight;
          this.minY = -(BANNER_HEIGHT + BANNER_HEIGHT_SPLIT);
          var top = BANNER_HEIGHT + TAG_HEIGHT + BANNER_HEIGHT_SPLIT + NAV_HEIGHT;
          bgLayerDom.style.top = `${top}px`;
          mainDom.style.top = `${top}px`;
          this.$nextTick(() => {
            this.$refs.scroll.refresh();
          });
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
      InfoItem,
      BackTop,
      NoResult,
      CTopic
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./clubDetail";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

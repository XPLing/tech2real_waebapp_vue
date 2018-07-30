<template>
  <transition name="slide">
    <div class="g-club-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-tag" :class="{'active':tagFloatFlag}" ref="tag" v-if="tagList">
        <div class="tag-item" v-for="(item, index) in tagList" :key="index"
             :class="{'active': tagCurrentIndex === index}"
             @click="changeTag(item, index)">
          {{item.name}}
        </div>
      </div>
      <div class="g-main" ref="main">
        <scroll ref="scroll" class="train-content" :pullup="true" :data="infoList" :probeType="probeType"
                @pullingUp="requestScrollData" :listenScroll="true" @scroll="scrollHandle">
          <div>
            <div class="g-info-list" v-if="infoList">
              <div class="info-type-item" v-for="(item,index) in infoList" :key="index"
                   v-show="tagCurrentIndex===index">
                <div v-if="item.length>0">
                  <reply-list v-if="index===1" :reply-list="item" @selectReply="selectReply"
                              @like="likeReply"></reply-list>
                  <c-topic v-else :data-list="item" @selectItem="selectTopic" @like="likeTopic"></c-topic>
                </div>
                <div v-if="item.length<=0" class="no-result-wrapper">
                  <no-result :title="'暂无内容~~'"></no-result>
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
        <router-view></router-view>
      </keep-alive>
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
  import { mapGetters } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import { listMyClubReplies, listMyClubComments } from 'api/me';
  import { listCommentsByTargetId, likeCommentV2 } from 'api/comment';
  import BackTop from 'base/backtop/backtop';
  import CTopic from 'base/club-topic/topic';
  import ReplyList from 'base/reply-list/reply-list';

  export default {
    data () {
      return {
        probeType: 2,
        toptipTxt: '',
        pageTitle: '我的话题',
        tagList: [
          {
            name: '我的话题'
          },
          {
            name: '我的回答'
          }
        ],
        tagCurrentIndex: 0,
        requestMoreFlag: [false, false],
        requestFun: ['_listMyClubComments', '_listMyClubReplies'],
        noMore: [false, false],
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        infoPage: [1, 1],
        infoList: [],
        tagFloatFlag: false
      };
    },
    created () {
      // BANNER_HEIGHT = this.$refs.innerHeight;

      this.requestScrollData();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      selectTopic (data) {
        var url = `/community/${data.id}`;
        this.$router.push({
          path: url
        });
      },
      selectReply (data) {
        var url = `/community/${data.commentId}`;
        this.$router.push({
          path: url
        });
      },
      likeReply (data) {
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
      likeTopic (data) {
        if (data.isLike === 'N' && !this.likeFlag) {
          this.likeFlag = true;
          this._likeCommentV2(1, data.id).then((res) => {
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
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      scrollHandle (pos) {
        this.scrollY = pos.y;
      },
      changeTag (item, index) {
        this.tagCurrentIndex = index;
        if (!this.infoList[this.tagCurrentIndex] && !this.requestMoreFlag[[this.tagCurrentIndex]]) {
          this.requestScrollData();
        }
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      requestScrollData () {
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
      _listMyClubReplies (page) {
        var param = {
          page: page,
          page_size: 10,
          userGuid: this.userGuid
        };
        return listMyClubReplies(param);
      },
      _listMyClubComments (page) {
        var param = {
          limitSize: 10,
          page: page,
          userGuid: this.userGuid
        };
        return listMyClubComments(param);
      },
      _likeCommentV2 (type, targetId) {
        var param = {
          isLike: 'Y',
          clientType: 1,
          type: type,
          userGuid: this.userGuid,
          targetId: targetId
        };
        return likeCommentV2(param);
      }
    },
    watch: {
      infoList () {
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
      CTopic,
      ReplyList
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myTopic";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

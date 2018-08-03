<template>
  <transition name="slide">
    <div class="g-info-comment-item">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="community" ref="scroll" :pullup="true" :probeType="probeType"
                :listenScroll="listenScroll" @pullingUp="requestReply">
          <div>
            <div class="comment">
              <div v-if="community">
                <community-list :community-list="community" @selectCommunity="selectCommunity"
                                @like="likeComment"></community-list>
              </div>
            </div>
            <p class="comment-count"></p>
            <div class="reply">
              <div v-if="replyList">
                <reply-list :reply-list="replyList" @selectReply="selectReply" @like="likeReply"></reply-list>
              </div>
              <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : noResult}}</p>
            </div>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <router-link
        :to="`/activity/list/detail/${this.$route.params.id}/commentlist/${this.$route.params.commentId}/commentform`"
        class="add-comment">
        <i class="icon c-icon-pencil"></i>
      </router-link>
      <router-view :comment-form-placeholder="`@${placeholder}:`" :type="'reply'" @update="update"></router-view>
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
  import { getCommentById, listRepliesByCommentId, likeCommentV2 } from 'api/info';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import InfoItemLeft from 'base/info-item-left/info-item-left';
  import CommunityList from 'base/community-list/community-list';
  import ReplyList from 'base/reply-list/reply-list';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '',
        articleInfo: null,
        probeType: 2,
        listenScroll: true,
        replyList: null,
        community: null,
        placeholder: '',
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1
      };
    },
    created () {
      this.commentId = this.$route.params.commentId;
      this.id = this.$route.params.id;
      this.pageTitle = this.$route.query.title;
      this.isUpdate = false;
      this.dataInit();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      likeComment (data) {
        console.log(data);
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
              this.$emit('update');
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      likeReply (data) {
        console.log(data);
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
      update () {
        this.requestPage = 1;
        this.replyList = null;
        this.noMore = false;
        this.requestMoreFlag = false;
        this.isUpdate = true;
        this.dataInit();
      },
      dataInit () {
        return this._getCommentById().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.community = [res.result];
            this.placeholder = res.result.nickname;
            this.requestReply();
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      selectReply (data) {
        this.$router.push({
          path: `commentform`,
          append: true,
          query: {
            replyId: data.replyId,
            replyUserGuid: data.replyUserGuid
          }
        });
      },
      selectCommunity (data) {
        this.$router.push({
          path: `commentform`,
          append: true
        });
      },
      requestReply () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listRepliesByCommentId(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.replyList) {
                  this.replyList = this.replyList.concat(res.result);
                } else {
                  this.replyList = res.result;
                }
                this.requestPage = this.requestPage + 1;
              } else {
                this.noMore = true;
                this.$refs.scroll.closePullUp();
                this.$nextTick(() => {
                  this.$refs.scroll.refresh();
                });
              }
              if (this.isUpdate) {
                this.isUpdate = false;
                this.$emit('update');
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
      _getCommentById () {
        var param = {
          userGuid: this.userGuid,
          id: this.commentId
        };
        return getCommentById(param);
      },
      _listRepliesByCommentId (page) {
        var param = {
          page: page,
          limitSize: 10,
          userGuid: this.userGuid,
          id: this.commentId
        };
        return listRepliesByCommentId(param);
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
      replyList () {
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
      InfoItemLeft,
      CommunityList,
      ReplyList
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./comment-item";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

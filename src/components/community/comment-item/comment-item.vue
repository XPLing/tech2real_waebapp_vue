<template>
  <transition name="slide">
    <div class="g-community-comment-item">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="community" ref="scroll" :pullup="true" :probeType="probeType"
                :listenScroll="listenScroll" @pullingUp="requestReply">
          <div>
            <div class="comment">
              <div v-if="community">
                <community-club-item :community="community" @selectItem="selectCommunity" @selectClub="selectClub"
                                     @like="likeComment" @deleteComment="deleteComment">
                </community-club-item>
              </div>
            </div>
            <p class="comment-count" v-if="community">{{community.replyCount}}条回复</p>
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
        :to="{path:`commentform`,append: true}"
        class="add-comment">
        <i class="icon c-icon-pencil"></i>
      </router-link>
      <router-view :comment-form-placeholder="`@${placeholder}:`" :type="'reply'" @replayUpdate="update"></router-view>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @confirm="confirm"></confirm>
      <g-mask @clickMask="clickMask" ref="mask"></g-mask>
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
  import { getCommentById, listRepliesByCommentId, likeCommentV2 } from 'api/info';
  import { deleteCommentV2 } from 'api/comment';
  import { imgOnload } from 'assets/js/imgOnload';
  import InfoItemLeft from 'base/info-item-left/info-item-left';
  import CommunityClubItem from 'base/community-club-item/community-club-item';
  import ReplyList from 'base/reply-list/reply-list';
  import Confirm from 'base/confirm/confirm';
  import Mask from 'base/mask/mask';

  export default {
    name: 'NKA_communityItem',
    data () {
      return {
        toptipTxt: '',
        pageTitle: '话题讨论',
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
        requestPage: 1,
        confirmTxt: '确定删除该话题？'
      };
    },
    created () {
      this.commentId = this.$route.params.commentId;
      this.articleId = this.$route.params.articleId;
      this.isUpdate = false;
      this.dataInit();
    },
    activated(){

    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      selectClub (data) {
        this.$router.push({
          path: `/clubs/clubdetail/${data.club.guid}`
        });
      },
      likeComment (data) {
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
            this.$emit('dataUpdate');
            this.$router.back();
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      clickMask () {

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
            this.community = res.result;
            this.placeholder = res.result.nickname;
            this.requestReply();
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      selectReply (data) {
        this.placeholder = data.nickname;
        this.$router.push({
          path: `commentform`,
          append: true,
          query: {
            replyId: data.id,
            replyUserGuid: data.userGuid
          }
        });
      },
      selectCommunity (data) {
        this.placeholder = data.nickname;
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
          type: type,
          userGuid: this.userGuid,
          targetId: targetId
        };
        return likeCommentV2(param);
      },
      _deleteCommentV2 () {
        var param = {
          userGuid: this.userGuid,
          id: this.commentId
        };
        return deleteCommentV2(param);
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
      CommunityClubItem,
      ReplyList,
      Confirm,
      'g-mask': Mask
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

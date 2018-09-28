<template>
  <transition name="slide">
    <div class="g-info-comment">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="communityList" ref="scroll" :pullup="true" :probeType="probeType"
                :listenScroll="listenScroll" @pullingUp="requestCommunity">
          <div>
            <div class="comment" v-if="communityList">
              <community-list :community-list="communityList" @selectCommunity="selectCommunity"
                              @like="like"></community-list>
            </div>
            <div class="no-result" v-show="!communityList">
              <no-result :title="'没有找到您要的内容'"></no-result>
            </div>
            <p v-show="communityList && (requestMoreFlag || noMore)" class="request-result">
              {{noMore ? noMoreStr : noResult}}</p>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <router-view :comment-form-placeholder="'请输入评论内容'" :type="'comment'" @update="update"></router-view>
      <router-link :to="`/info/infodetail/${this.$route.params.articleId}/commentlist/commentform`" class="add-comment">
        <i class="icon c-icon-pencil"></i>
      </router-link>
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
  import { listCommentsByTargetId, likeCommentV2 } from 'api/info';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import InfoItemLeft from 'base/info-item-left/info-item-left';
  import CommunityList from 'base/community-list/community-list';

  export default {
    inject: ['updateCommunity'],
    data () {
      return {
        toptipTxt: '',
        pageTitle: '',
        articleInfo: null,
        probeType: 2,
        listenScroll: true,
        recommendList: null,
        communityList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        isFirstEnter: true
      };
    },
    beforeRouteEnter (to, from, next) {
      if (from.name === 'infoDetail_commentForm') { // 这个name是下一级页面的路由name
        to.meta.isBack = true; // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
      }
      next();
    },
    created () {

    },
    activated () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.commentId = this.$route.params.commentId;
        this.articleId = this.$route.params.articleId;
        this.pageTitle = this.$route.query.title;
        this.isUpdate = false;
        this.requestCommunity();
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      like (data) {
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
      update () {
        this.requestPage = 1;
        this.communityList = null;
        this.noMore = false;
        this.requestMoreFlag = false;
        this.isUpdate = true;
        this.requestCommunity();
      },
      selectCommunity (data) {
        this.$router.push({
          path: `${data.id}`,
          append: true,
          query: {
            title: `${this.pageTitle}`
          }
        });
      },
      requestCommunity () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listCommentsByTargetId(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.communityList) {
                  this.communityList = this.communityList.concat(res.result);
                } else {
                  this.communityList = res.result;
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
                 // this.updateCommunity();
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
      _listCommentsByTargetId (page) {
        var param = {
          page: page,
          type: 2,
          userGuid: this.userGuid,
          targetId: this.articleId
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
      }
    },
    watch: {
      communityList () {
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
      CommunityList
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./comment";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

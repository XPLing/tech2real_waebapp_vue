<template>
  <transition name="slide">
    <div class="g-info-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="articleInfo" @scroll="descImage" ref="scroll" :probeType="probeType"
                :listenScroll="listenScroll">
          <div>
            <!--<div class="g-title" v-if="articleInfo">-->
            <!--<h1 class="title">{{articleInfo.listTitle}}</h1>-->
            <!--<p class="subtitle">{{articleInfo.tag}} ● {{articleInfo.author}} ● {{articleInfo.createdTime}}</p>-->
            <!--</div>-->
            <article class="g-article-cont wechat-article" id="articleCont" data-top-flog="true" v-if="articleInfo">
              <div class="rich_media_inner" v-html="articleInfo.content" ref="articleCont"></div>
            </article>
            <div class="community">
              <div class="community-cont" v-if="clubInfo">
                <p class="cont-item avatar">
                  <img :src="clubInfo.logoUrl">
                </p>
                <div class="desc">
                  <p class="title">{{clubInfo.name}}</p>
                  <p class="intro">{{clubInfo.profile | ellipsis(28)}}</p>
                </div>
                <p class="btn">
                  <router-link :to="`/f`">
                    <i class="icon">+</i>
                    <span>加入</span>
                  </router-link>
                </p>
              </div>
            </div>
            <div class="comment">
              <p class="title"><i class="icon c-icon-comment-circle"></i><span>最新评论</span></p>
              <div v-if="communityList">
                <community-list :community-list="communityList" @selectCommunity="selectCommunity"></community-list>
              </div>
              <router-link class="btn" :to="'/'">查看更多评论</router-link>
            </div>
            <div class="recommend">
              <p class="title"><i class="icon c-icon-recommend"></i><span>推荐阅读</span></p>
              <ul class="list" v-if="recommendList">
                <info-item-left :info="item" v-for="(item, index) in recommendList" :key="index"
                                @selectInfo="selectInfo"></info-item-left>
              </ul>
            </div>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <div class="control-bar">
        <p>
          <i class="icon c-icon-heart"></i>
          <span class="name">喜欢 <i v-if="articleInfo && articleInfo.likeUserCount>0">({{articleInfo.likeUserCount}})</i> </span>
        </p>
        <p>
          <i class="icon c-icon-star" :class="{'active': articleInfo && articleInfo.isRecommend === 'Y'}"></i>
          <span class="name">收藏 <i v-if="articleInfo && articleInfo.likeUserCount>0">({{articleInfo.likeUserCount}})</i> </span>
        </p>
        <p>
          <i class="icon c-icon-share"></i>
          <span class="name">分享 <i v-if="articleInfo && articleInfo.likeUserCount>0">({{articleInfo.likeUserCount}})</i> </span>
        </p>
        <p>
          <i class="icon c-icon-comment-square-o"></i>
          <span class="name">评论 <i v-if="articleInfo && articleInfo.likeUserCount>0">({{articleInfo.likeUserCount}})</i> </span>
        </p>
      </div>
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
  import { getArticleById, getClubByClubGuid, listRecommendArticles, listCommentsByTargetId } from 'api/info';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import InfoItemLeft from 'base/info-item-left/info-item-left';
  import CommunityList from 'base/community-list/community-list';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '资讯详情',
        articleInfo: null,
        probeType: 2,
        listenScroll: true,
        introImgs: [],
        loadedImgs: [],
        clubInfo: null,
        recommendList: null,
        communityList: null
      };
    },
    created () {
      this.articleId = this.$route.params.id;
      this._getArticleById().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.articleInfo = res.result;
          this._getClubByClubGuid().then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              this.clubInfo = res.result;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
          this._listCommentsByTargetId().then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              this.communityList = res.result;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._listRecommendArticles().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.recommendList = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });

    },
    computed: {
      loadingImgs () {
        if (this.loadedImgs.length > 0) {
          for (var i = 0, len = this.loadedImgs.length; i < len; i++) {
            var item = this.loadedImgs[i];
            this.introImgs.splice(item, 1);
          }
        }
        return this.introImgs;
      },
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      selectCommunity (data) {

      },
      selectInfo (info) {

      },
      descImage () {
        if (this.loadingImgs.length > 0) {
          var imgs = this.loadingImgs;
          if (imgs.length < 0) {
            return;
          }
          imgOnload(imgs, this, 'descImageLoaded').then((res) => {
            this.loadedImgs = res.loaded;
            this.$nextTick(() => {
              this.$refs.scroll.refresh();
            });
            if (res.index === imgs.length - 1) {
              this.descImageLoaded = true;
              this.$refs.scroll.scroll.off('scroll');
            }
          });
        } else {
          this.$refs.scroll.scroll.off('scroll');
        }
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      _getArticleById () {
        var param = {
          article_id: this.articleId,
          user_guid: this.userGuid
        };
        return getArticleById(param);
      },
      _getClubByClubGuid () {
        var param = {
          product_guid: this.productGuid,
          club_guid: this.articleInfo.clubGuid,
          user_guid: this.userGuid
        };
        return getClubByClubGuid(param);
      },
      _listRecommendArticles () {
        var param = {
          product_guid: this.productGuid,
          page: 1,
          page_size: 10,
          user_guid: this.userGuid
        };
        return listRecommendArticles(param);
      },
      _listCommentsByTargetId () {
        var param = {
          type: 2,
          userGuid: this.userGuid,
          targetId: this.articleInfo.id
        };
        return listCommentsByTargetId(param);
      }
    },
    watch: {
      articleInfo () {
        this.$nextTick(() => {
          this.introImgs = [];
          var nodelist = this.$refs.articleCont.querySelectorAll('img');
          for (var i = 0, len = nodelist.length; i < len; i++) {
            this.introImgs.push(nodelist[i]);
          }
        });
      },
      clubInfo () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      recommendList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
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
  /*@import "~assets/scss/wechat-article";*/
  @import "./infoDetail";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

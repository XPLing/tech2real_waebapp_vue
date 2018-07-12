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
            <div class="comment" v-if="communityList && communityList.length>0">
              <p class="title"><i class="icon c-icon-comment-circle"></i><span>最新评论</span></p>
              <community-list :community-list="communityList" @selectCommunity="selectCommunity"
                              @like="like"></community-list>
              <router-link class="btn"
                           :to="{path:`/info/infodetail/${this.articleId}/commentlist`, query: {title:`${this.pageTitle}`}}">
                查看更多评论
              </router-link>
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
        <p @click.stop="setFavorite">
          <i class="icon c-icon-heart" :class="{'active': viewArticle && viewArticle.favoriteFlag === 'Y'}"></i>
          <span class="name">喜欢 <i v-if="viewArticle && viewArticle.favoriteCount>0">({{viewArticle.favoriteCount}})</i> </span>
        </p>
        <p @click.stop="setLike">
          <i class="icon c-icon-star" :class="{'active': viewArticle && viewArticle.likeFlag === 'Y'}"></i>
          <span class="name">收藏 <i v-if="viewArticle && viewArticle.likeCount>0">({{viewArticle.likeCount}})</i> </span>
        </p>
        <!--<p>-->
        <!--<i class="icon c-icon-share"></i>-->
        <!--<span class="name">分享</span>-->
        <!--</p>-->
        <router-link tag="p"
                     :to="{path:`/info/infodetail/${this.articleId}/commentlist`, query: {title:`${this.pageTitle}`}}">
          <i class="icon c-icon-comment-square-o"></i>
          <span class="name">评论 <i v-if="viewArticle && viewArticle.commentCount>0">({{viewArticle.commentCount}})</i> </span>
        </router-link>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <back-top ref="backTop" @backTop="backTop"></back-top>
      <router-view @update="updateCommunity"></router-view>
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
  import {
    getArticleById,
    getClubByClubGuid,
    listRecommendArticles,
    listCommentsByTargetId,
    likeCommentV2,
    viewArticle,
    favoriteArticle,
    unfavoriteArticle,
    likeArticle,
    unlikeArticle
  } from 'api/info';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import InfoItemLeft from 'base/info-item-left/info-item-left';
  import CommunityList from 'base/community-list/community-list';

  export default {
    inject: ['reload'],
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        if (from.name === 'activity') {
          vm.articleId = to.params.articleId;
          vm.reload();
        }
      });
    },
    data () {
      return {
        toptipTxt: '',
        pageTitle: '资讯详情',
        articleInfo: null,
        probeType: 3,
        listenScroll: true,
        introImgs: [],
        loadedImgs: [],
        clubInfo: null,
        recommendList: null,
        communityList: null,
        viewArticle: null,
        scrollY: 0,
        articleId: 0
      };
    },
    created () {
      this.articleId = this.$route.params.articleId;
      this.likeFlag = true;
      this._getArticleById().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.articleInfo = res.result;
          this.pageTitle = res.result.listTitle;
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
          this.getcommunity();
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
      this._viewArticle().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.viewArticle = res.result;
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
      setLike () {
        if (this.viewArticle.likeFlag === 'Y') {
          this._unlikeArticle().then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              this.viewArticle.likeFlag = 'N';
              this.viewArticle.likeCount = this.viewArticle.likeCount - 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });

        } else {
          this._likeArticle().then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              this.viewArticle.likeFlag = 'Y';
              this.viewArticle.likeCount = this.viewArticle.likeCount + 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });

        }
      },
      setFavorite () {
        if (this.viewArticle.favoriteFlag === 'Y') {
          this._unfavoriteArticle().then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              this.viewArticle.favoriteFlag = 'N';
              this.viewArticle.favoriteCount = this.viewArticle.favoriteCount - 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        } else {
          this._favoriteArticle().then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              this.viewArticle.favoriteFlag = 'Y';
              this.viewArticle.favoriteCount = this.viewArticle.favoriteCount + 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      updateCommunity () {
        this.getcommunity();
      },
      getcommunity () {
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
      },
      selectCommunity (data) {
        this.$router.push({
          path: `/info/infodetail/${this.articleId}/commentlist/${data.id}`,
          query: {
            title: `${this.pageTitle}`
          }
        });
      },
      like (data) {
        if (data.isLike === 'N' && !data.likeFlag) {
          data.likeFlag = false;
          this._likeCommentV2(data.id).then((res) => {
            data.likeFlag = true;
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
      selectInfo (info) {
        var url = `/info/infodetail/${info.id}`;
        this.$router.push({
          path: url
        });
      },
      descImage (pos) {
        this.scrollY = pos.y;
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
              // this.$refs.scroll.scroll.off('scroll');
            }
          });
        } else {
          // this.$refs.scroll.scroll.off('scroll');
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
          limitSize: 5,
          page: 1,
          type: 2,
          userGuid: this.userGuid,
          targetId: this.articleInfo.id
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
      _viewArticle () {
        var param = {
          article_id: this.articleId,
          clientType: 1,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return viewArticle(param);
      },
      _likeArticle () {
        var param = {
          article_id: this.articleId,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return likeArticle(param);
      },
      _unlikeArticle () {
        var param = {
          article_id: this.articleId,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return unlikeArticle(param);
      },
      _favoriteArticle () {
        var param = {
          article_id: this.articleId,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return favoriteArticle(param);
      },
      _unfavoriteArticle () {
        var param = {
          article_id: this.articleId,
          product_guid: this.productGuid,
          user_guid: this.userGuid
        };
        return unfavoriteArticle(param);
      }
    },
    watch: {
      scrollY (newVal) {
        if (newVal < -100) {
          if (!this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.showIcon();
          }
        } else {
          if (this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.hideIcon();
          }
        }
      },
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
      },
      $route (to, from) {
        if (to.name === 'infoDetail') {
          if (/infoDetail/.test(from.name)) {
            this.reload();
          }
        }
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

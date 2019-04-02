<template>
  <transition name="slide">
    <div class="g-info-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <download v-if="isShare" ref="downloadAppFixed" :is-fixed="true"></download>
      <div class="g-main">
        <scroll :data="articleInfo" @scroll="descImage" ref="scroll" :probeType="probeType"
                :listenScroll="listenScroll">
          <div>
            <!--<div class="g-title" v-if="articleInfo">-->
            <!--<h1 class="title">{{articleInfo.listTitle}}</h1>-->
            <!--<p class="subtitle">{{articleInfo.tag}} ● {{articleInfo.author}} ● {{articleInfo.createdTime}}</p>-->
            <!--</div>-->
            <download v-if="isShare" ref="downloadApp"></download>
            <article class="g-article-cont wechat-article" id="articleCont" data-top-flog="true"
                     v-if="articleInfo">
              <div class="rich_media_inner" v-html="articleInfoContent" ref="articleCont"></div>
            </article>
            <div class="community">
              <div class="community-cont" v-if="clubInfo" @click="selectClub">
                <p class="cont-item avatar">
                  <img :src="clubInfo.logoUrl">
                </p>
                <div class="desc">
                  <p class="title">{{clubInfo.name}}</p>
                  <p class="intro">{{clubInfo.profile | ellipsis(28)}}</p>
                </div>
                <p class="btn">
                  <a href="javascript:void(0);" :class="{'joined': clubInfo.userClubId==1}" @click.stop="joinClub"
                     v-if="clubInfo.isDefault==='N'">
                    <i class="icon" v-if="clubInfo.userClubId !== 1">+</i>
                    <span>{{clubInfo.userClubId == 1 ? '已加入' : '加入'}}</span>
                  </a>
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
            <div class="download-app">
              <download ref="downloadApp"></download>
            </div>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <div class="control-bar">
        <p @click.stop="operate('setLike')">
          <i class="icon c-icon-heart" :class="{'active': viewArticle && viewArticle.likeFlag === 'Y'}"></i>
          <span class="name">喜欢 <i
            v-if="viewArticle && viewArticle.likeCount>0">({{viewArticle.likeCount}})</i> </span>
        </p>
        <p @click.stop="operate('setFavorite')">
          <i class="icon c-icon-star"
             :class="{'active': viewArticle && viewArticle.favoriteFlag === 'Y'}"></i>
          <span class="name">收藏 <i v-if="viewArticle && viewArticle.favoriteCount>0">({{viewArticle.favoriteCount}})</i> </span>
        </p>
        <p @click.stop="operate('showShare')">
          <i class="icon c-icon-share"></i>
          <span class="name">分享</span>
        </p>
        <router-link tag="p"
                     :to="{path:`/info/infodetail/${this.articleId}/commentlist`, query: {title:`${this.pageTitle}`}}">
          <i class="icon c-icon-comment-square-o"></i>
          <span class="name">评论 <i v-if="viewArticle && viewArticle.commentCount>0">({{viewArticle.commentCount}})</i> </span>
        </router-link>
      </div>
      <share @cancel="shareCancel" @share="share" @error="shareError" :share-info="shareInfo"
             @getConfigStart="shareGetConfigStart" @getConfigEnd="shareGetConfigEnd" ref="share"></share>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @confirm="confirm"></confirm>
      <back-top ref="backTop" @backTop="backTop"></back-top>
      <loading ref="loading" :title="loadingTxt"></loading>
      <keep-alive :include="keepAliveList" :exclude="notkeepAliveList">
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
  import download from 'components/download/download';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import { signPublicClubInView, quitClub } from 'api/club';
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
  import Share from 'base/share/share';
  import Confirm from 'base/confirm/confirm';

  const DOWNLOADAPP_HEIGHT = util.common.calculateWH(52);
  export default {
    name: 'KA_infoDetail',
    provide () {
      return {
        updateCommunity: this.updateCommunity
      };
    },
    data () {
      return {
        keepAliveList: /^KA_infoDetail/,
        notkeepAliveList: ['NKA_infoDetailCommentItem'],
        toptipTxt: '',
        loadingTxt: '',
        pageTitle: '资讯详情',
        articleInfo: null,
        articleInfoContent: null,
        probeType: 3,
        listenScroll: true,
        introImgs: [],
        loadedImgs: [],
        clubInfo: null,
        recommendList: null,
        communityList: null,
        viewArticle: null,
        scrollY: 0,
        scrollDirection: 0,
        articleId: 0,
        shareInfo: null,
        imgsLoadStatus: 'ready',
        isShare: false,
        confirmTxt: ''
      };
    },
    created () {
//      this.likeFlag = true;
//      this.initData();
    },
    activated () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.initData();
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    computed: {
      loadingImgs () {
        var arr = [];
        if (this.loadedImgs.length > 0) {
          for (var i = 0, len = this.introImgs.length; i < len; i++) {
            var item = this.introImgs[i];
            for (var j = 0, jlen = this.loadedImgs.length; j < jlen; j++) {
              var jitem = this.loadedImgs[i];
              if (jitem !== item) {
                arr.push(item);
              }
            }
          }
        } else {
          arr = this.introImgs;
        }
        return arr;
      },
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      confirm () {
        if (!this.userGuid) {
          this.$router.push({
            path: '/user/login'
          });
        }
      },
      initData () {
        this.isShare = this.$route.query.share;
        this.articleId = this.$route.params.articleId;
        this._getArticleById().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.articleInfo = res.result;
            this.articleInfoContent = this.articleInfo.content.replace(/(width|height|min-width|min-height|max-width|max-height)\s*?(:|=)\s*?\d+[^%]*?;/ig, '');
            this.pageTitle = res.result.listTitle;
            this.shareInfo = {
              url: window.location.href,
              cover: this.articleInfo.pictureUrl,
              desc: this.articleInfo.brief,
              title: this.articleInfo.listTitle,
              summary: this.articleInfo.listTitle
            };
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
      operate (type) {
        if (!this.userGuid) {
          this.confirmTxt = '请先登录！';
          this.$refs.confirmsWrapper.show();
          return;
        }
        this[type]();
      },
      showShare () {
        this.$refs.share.show();
      },
      shareCancel () {

      },
      shareError (erro) {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      },
      shareGetConfigStart () {
        this.loadingTxt = '环境初始化中...';
        this.$refs.loading.show();
      },
      shareGetConfigEnd () {
        this.$refs.loading.hide();
      },
      share (data) {
        switch (data) {
          case 0:
            this.$router.push({
              name: 'community_commentFormRoot',
              params: {
                shareData: this.articleInfo,
                shareType: 2
              }
            });
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
        }
      },
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
      selectClub () {
        var url = `/clubs/clubdetail/${this.clubInfo.guid}`;
        this.$router.push({
          path: url
        });
      },
      joinClub () {
        if (!this.userGuid) {
          this.confirmTxt = '请先登录！';
          this.$refs.confirmsWrapper.show();
          return;
        }
        var data = this.clubInfo;
        if (data.userClubId !== 1) {
          this._signPublicClubInView(data.guid).then((res) => {
            if (res.status) {
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
        } else {
          this._quitClub(data.guid).then((res) => {
            if (res.status) {
              if (res.status !== ERR_OK_STR) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.userClubId = -2;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      descImage (pos) {
        this.scrollY = pos.y;
        if (this.loadingImgs.length > 0 && this.imgsLoadStatus === 'ready') {
          var imgs = this.loadingImgs;
          this.imgsLoadStatus = 'loading';
          if (imgs.length < 0) {
            this.imgsLoadStatus = 'loaded';
            return;
          }
          Promise.all(imgOnload(imgs, this, 'descImageLoaded')).then((res) => {
            this.imgsLoadStatus = 'loaded';
            this.loadedImgs = res;
            this.$nextTick(() => {
              this.$refs.scroll.refresh();
            });
//            if (res.loaded.length === this.introImgs.length) {
//              // this.$refs.scroll.scroll.off('scroll');
//            }
          }).catch((error) => {
            this.$refs.scroll.refresh();
            console.log('加载富文本图片失败');
            console.log(error);

          });
        } else {
          // this.$refs.scroll.scroll.off('scroll');
        }
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      ...mapMutations({
        updataBeforeLoginPage: 'UPDATA_BEFORELOGINPAGE'
      }),
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
          page_size: 2,
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
          type: 1,
          userGuid: this.userGuid,
          targetId: id
        };
        return likeCommentV2(param);
      },
      _viewArticle () {
        var param = {
          article_id: this.articleId,
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
        if (newVal < -100 && this.$refs.scroll.directionY === -1) {
          if (!this.$refs.backTop.backTopShowFlag && this.$refs.scroll.directionY === -1) {
            this.$refs.backTop.showIcon();
          }
        } else {
          if (this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.hideIcon();
          }
        }
        if (this.isShare) {
          if (newVal < -DOWNLOADAPP_HEIGHT && this.$refs.scroll.directionY === -1) {
            this.$refs.downloadAppFixed.show();
          } else {
            this.$refs.downloadAppFixed.hide();
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
        if (to.name === from.name) {
          this.initData();
          this.$refs.scroll.scrollTo(0, 0);
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
      CommunityList,
      Share,
      download,
      Confirm
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

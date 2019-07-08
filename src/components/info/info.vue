<template>
  <div class="g-info">
    <header class="g-header">
      <HeaderTitle :title="pageTitle"></HeaderTitle>
    </header>
    <div class="g-banner" v-if="bannerList">
      <swiper :options="swiperOPts" class="g-swiper">
        <swiper-slide v-for="(item, index) in bannerList" :key="index">
          <img :src="item.coverUrl" @click="bannerClick(item)">
        </swiper-slide>
        <div class="swiper-pagination swiper-pagination-banner" slot="pagination"></div>
      </swiper>
    </div>
    <div class="g-tag" :class="{'active':tagFloatFlag}" ref="tag" v-if="tagList">
      <swiper :options="swiperOPts_tag" class="g-swiper">
        <swiper-slide v-for="(item, index) in tagList" :key="index">
          <div class="tag-item" :class="{'active': tagCurrentIndex === index}"
               @click="changeTag(item, index)">
            {{item.name}}
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <div class="g-main" ref="main">
      <scroll ref="scroll" class="train-content" :pullup="true" :data="bannerList" :probeType="probeType"
              @pullingUp="requestInfo" :listenScroll="true" @scroll="scrollHandle">
        <div>
          <div class="g-info-list" v-if="infoList.length>0">
            <div class="info-type-item" v-for="(item,index) in infoList" :key="index"
                 v-show="tagCurrentIndex===index">
              <ul class="list">
                <info-item :show-special="true" :current-tag="tagCurrentIndex+1" :tag-count="tagList && tagList.length"
                           :info="Iitem"
                           v-for="(Iitem, Iindex) in item"
                           :key="`${index}-${Iindex}`" @selectClubItem="selectClubItem" @joinClub="joinClub"
                           @selectInfo="selectInfo"></info-item>
              </ul>
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
    <confirm ref="confirmsWrapper" :text="confirmTxt" :isDialog="true"></confirm>
    <back-top ref="backTop" @backTop="backTop"></back-top>
    <keep-alive :include="keepAliveList">
      <router-view></router-view>
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
  import { listNewsCategories, listNewsArticlesByCategory, listArticlesByClubGuids } from 'api/info';
  import { signPublicClubInView, quitClub, getClubByClubGuid } from 'api/club';
  import listBannersByLocationType from 'api/banner';
  import BackTop from 'base/backtop/backtop';
  import Confirm from 'base/confirm/confirm';

  const NAV_HEIGHT = util.common.calculateWH(40);
  const TAG_HEIGHT = util.common.calculateWH(44);
  const BANNER_HEIGHT = util.common.calculateWH(260);
  const transform = util.common.cssPrefix('transform');

  export default {
    name: 'KA_rootInfo',
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        confirmTxt: '',
        keepAliveList: /^KA_infoDetail/,
        probeType: 3,
        toptipTxt: '',
        pageTitle: '资讯',
        currView: 'v-a',
        isRouterAlive: true,
        swiperOPts: {
          loop: false,
          autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination-banner',
            clickable: true
          }
        },
        swiperOPts_tag: {
          freeMode: true,
          slidesPerView: 4,
          pagination: false
        },
        tagList: null,
        requestDataName: ['_listNewsArticlesByCategory', '_listArticlesByClubGuids', '_listArticlesByClubGuids'],
        tagCurrentIndex: 0,
        bannerList: null,
        requestMoreFlag: [],
        noMore: [],
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        infoPage: [],
        infoList: [],
        scrollY: 0,
        tagFloatFlag: false
      };
    },
    created () {
      this.minY = -BANNER_HEIGHT;
      this.oldTop = 0;
      this._listBannersByLocationType().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            return Promise.reject(res);
          }
          this.bannerList = res.result;
        }
      }).catch(erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._listNewsCategories().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            return Promise.reject(res);
          }
          this.tagList = res.result;
          for (var tagIndex = 0, tagLen = this.tagList.length; tagIndex < tagLen; tagIndex++) {
            this.$set(this.requestMoreFlag, tagIndex, false);
            this.$set(this.infoPage, tagIndex, 1);
            this.$set(this.noMore, tagIndex, false);
          }
          for (var i = 0, len = res.result.length; i < len; i++) {
            this.$set(this.infoList, i, []);
          }
          this.requestInfo();
        }
      }).catch(erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    activated () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {

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
      selectClubItem (data) {
        var url = `/clubs/clubdetail/${data.guid}`;
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
      joinClub (data) {
        if (data.userClubId !== 1) {
          this._signPublicClubInView(data.guid).then((res) => {
            if (res.status !== ERR_OK_STR) {
              this.toptipTxt = res.results.message;
              this.$refs.toptip.show();
              return false;
            }
            data.userClubId = 1;
            console.log(res);
            this.confirmTxt = res.results.message;
            this.$refs.confirmsWrapper.show();
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
      selectInfo (info) {
        var url = `/info/infodetail/${info.id}`;
        this.$router.push({
          path: url
        });
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      scrollHandle (pos) {
        this.scrollY = pos.y;
      },
      changeTag (item, index) {
        this.tagCurrentIndex = index;
        if (this.tagCurrentIndex === this.tagList.length - 1 && this.infoList[this.tagCurrentIndex].length === 0) {
          this.requestInfo();
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
      requestInfo () {
        if (this.noMore[this.tagCurrentIndex]) {
          return;
        }
        if (!this.requestMoreFlag[[this.tagCurrentIndex]]) {
          this.$set(this.requestMoreFlag, this.tagCurrentIndex, true);
          this[this.requestDataName[this.tagCurrentIndex]](this.tagList[this.tagCurrentIndex].id, this.infoPage[this.tagCurrentIndex]).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.$set(this.requestMoreFlag, this.tagCurrentIndex, false);
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.tagCurrentIndex === 0) {
                  res.result.forEach(function (value, i) {
                    value.timeValue = value.createdTime.split(' ')[0];
                  });
                }
                if (this.infoList[this.tagCurrentIndex]) {
                  this.$set(this.infoList, this.tagCurrentIndex, this.infoList[this.tagCurrentIndex].concat(res.result));
                } else {
                  this.$set(this.infoList, this.tagCurrentIndex, res.result);
                }
                this.infoPage[this.tagCurrentIndex] = this.infoPage[this.tagCurrentIndex] + 1;
              } else {
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
      bannerClick (data) {
        /**
         * banner type: 1.资讯 2.活动 3.课程 4.网页 5. 老师
         */
        var params = JSON.parse(data.params);
//        console.log(data.type);
        switch (data.type) {
          case 1:
            this.$router.push({
              path: `/info/infodetail/${params.id}`
            });
            break;
          case 2:
            this.$router.push({
              path: `/activity/detail/${params.id}`
            });
            break;
          case 3:
            this.$router.push({
              path: `/train/all/${params.id}`
            });
            break;
          case 4:
            window.open(params.url);
            break;
          case 5:
            this.$router.push({
              path: `/train/all/teacherdetail/${params.id}`
            });
            break;
        }
      },
      _getClubByClubGuid (guid) {
        var param = {
          club_guid: guid,
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return getClubByClubGuid(param, {
          concurrent: true
        });
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
      },
      _listBannersByLocationType () {
        var param = {
          productGuid: this.productGuid,
          type: 2,
          userGuid: this.userGuid
        };
        return listBannersByLocationType(param);
      },
      _listNewsCategories () {
        var param = {
          productGuid: this.productGuid,
          parentId: 132
        };
        return listNewsCategories(param);
      },
      _listNewsArticlesByCategory (id, page) {
        var param = {
          productGuid: this.productGuid,
          categoryId: id,
          page: page,
          limitSize: 10,
          version: 1
        };
        return listNewsArticlesByCategory(param);
      },
      _listArticlesByClubGuids (id, page) {
        var param = {
          userGuid: this.userGuid,
          page: page,
          limitSize: 10,
          version: 1
        };
        return listArticlesByClubGuids(param);
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
      $route (to, from) {
        if (from.name === 'clubDetail') {
          let info = this.infoList[this.infoList.length - 1];
          info = info.filter((val) => {
            return val.club;
          })[0].club.filter((val) => {
            return val.guid === from.params.clubguId;
          })[0];
          if (info && info.guid) {
            this._getClubByClubGuid(info.guid).then((res) => {
              if (res.code) {
                if (res.code != ERR_OK) {
                  return Promise.reject(res);
                }
                info.userClubId = res.result.userClubId;
              }
            }).catch(erro => {
              this.toptipTxt = erro.message;
              this.$refs.toptip.show();
            });
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
      InfoItem,
      BackTop,
      NoResult,
      Confirm
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./info";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

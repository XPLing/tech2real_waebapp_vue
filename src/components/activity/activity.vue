<template>
  <div class="g-activity">
    <header class="g-header">
      <HeaderTitle :title="pageTitle"></HeaderTitle>
    </header>
    <div class="g-main">
      <scroll ref="scroll" :data="bannerInfo">
        <div>
          <div class="g-banner" v-if="bannerInfo">
            <p class="cover"><img :src="bannerInfo.pictureUrl"></p>
            <div class="detail">
              <p class="title">{{bannerInfo.name}}</p>
              <p class="brief">{{bannerInfo.brief}}</p>
            </div>
          </div>
          <div class="g-recommend cont">
            <div class="titlebox org">
              <p class="icon left"><span class="small"></span><span class="big"></span></p>
              <p class="title">推荐内容</p>
              <p class="icon right"><span class="big"></span><span class="small"></span></p>
            </div>
            <div class="cont-swiper" v-if="contList">
              <swiper :options="swiperOPts_cont" class="g-swiper">
                <swiper-slide class="swiper-item" v-for="(item,index) in contList" :key="index">
                  <ul class="list-item">
                    <info-item :info="Iitem" v-for="(Iitem, Iindex) in item" :key="Iindex"
                               @selectInfo="selectInfo"></info-item>
                  </ul>
                </swiper-slide>
                <div class="swiper-pagination swiper-pagination-cont" slot="pagination"></div>
              </swiper>
            </div>
          </div>
          <div class="g-recommend clubs">
            <div class="titlebox green">
              <p class="icon left"><span class="small"></span><span class="big"></span></p>
              <p class="title">社群推荐</p>
              <p class="icon right"><span class="big"></span><span class="small"></span></p>
              <router-link class="more" :to="{path: '/clubs'}">更多社群</router-link>
            </div>
            <ul class="club-list" v-if="clubList">
              <clubs-item v-for="(citem, index) in clubList" :key="index" :club="citem"
                          @selectClub="selectClub"></clubs-item>
            </ul>
          </div>
          <div class="g-recommend activity">
            <div class="titlebox green">
              <p class="icon left"><span class="small"></span><span class="big"></span></p>
              <p class="title">活动推荐</p>
              <p class="icon right"><span class="big"></span><span class="small"></span></p>
              <router-link class="more" :to="{path: '/activity/list'}">更多活动</router-link>
            </div>
            <div class="activity-swiper" v-if="activitiesList">
              <swiper :options="swiperOPts_activity" class="g-swiper">
                <swiper-slide class="swiper-item" v-for="(item,index) in activitiesList" :key="index">
                  <ul>
                    <activity-item :data="item" @selectActivity="selectActivity"></activity-item>
                  </ul>
                </swiper-slide>
                <div class="swiper-pagination swiper-pagination-activity" slot="pagination"></div>
              </swiper>
            </div>
          </div>
          <div class="g-ad">
            <a href="http://m.mall.tech2real.com/">
              <img src="./bottom_bg.png">
              <div class="float-layer">
                <div class="main">
                  <div class="item info">
                    <p class="title">硬见商城</p>
                    <p class="subtitle">智能硬件爱好者的专属商城</p>
                  </div>
                  <div class="item control">
                    <p class="tag">beta</p>
                    <p class="btn">GO>></p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </scroll>
    </div>
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
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import InfoItem from 'base/info-item/info-item';
  import ClubsItem from 'base/clubs-item/clubs-item';
  import ActivityItem from 'base/activity-item/activity-item';
  import NoResult from 'base/no-result/no-result';
  import { listDiscoverArticles, listDiscoverContent, listDiscoverClubs, listDiscoverActivities } from 'api/activity';
  import BackTop from 'base/backtop/backtop';

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        isRouterAlive: true,
        toptipTxt: '',
        pageTitle: '活动',
        swiperOPts_activity: {
          loop: true,
          autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination-activity',
            clickable: true
          }
        },
        swiperOPts_cont: {
          slidesPerView: 1,
          loop: true,
          spaceBetween: 10,
          autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination-cont',
            clickable: true
          }
        },
        bannerInfo: null,
        contList: null,
        activitiesList: null,
        clubList: null,
        infoFirst: true,
        clubFirst: true
      };
    },
    created () {
      this._listDiscoverContent().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.bannerInfo = res.result.article;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._listDiscoverArticles().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return false;
          }
          var contList = [];
          if (res.result.length > 4) {
            contList = util.common.deuce(res.result, 4);
          } else {
            contList = this.result;
          }
          this.contList = contList;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._listDiscoverClubs().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return false;
          }
          this.clubList = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._listDiscoverActivities().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return false;
          }
          this.activitiesList = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    methods: {
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      selectActivity (data) {
        var url = `/activity/list/detail/${data.id}`;
        this.$router.push({
          path: url
        });
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
      selectClub (data) {
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
      _listDiscoverActivities () {
        var param = {
          userGuid: this.userGuid
        };
        return listDiscoverActivities(param);
      },
      _listDiscoverContent () {
        var param = {
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        return listDiscoverContent(param);
      },
      _listDiscoverArticles () {
        var param = {
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        return listDiscoverArticles(param);
      },
      _listDiscoverClubs () {
        var param = {
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        return listDiscoverClubs(param);
      }
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    watch: {
      contList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      activitiesList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
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
      InfoItem,
      BackTop,
      NoResult,
      ClubsItem,
      ActivityItem
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./activity";

</style>

<template>
  <div class="g-train">
    <scroll ref="scroll" class="train-content" :pullup="true" :data="bannerList" @scrollToEnd="requestCourses"
            @pullingUp="requestCourses">
      <div>
        <!--<header class="g-header">-->
        <!--<HeaderTitle :title="pageTitle"></HeaderTitle>-->
        <!--</header>-->
        <div class="g-banner">
          <swiper :options="swiperOPts" class="g-swiper">
            <swiper-slide v-for="(item, index) in bannerList" :key="index">
              <img :src="item.pictureUrl">
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-banner" slot="pagination"></div>
          </swiper>
        </div>
        <div class="g-tagList">
          <ul class="list">
            <li class="item" v-for="(item, index) in tagList" :key="index">
              <router-link :to="{path: `/train/tagdetail/${item.id}`}">
                <p class="icon">
                  <img :src="item.bgUrl">
                </p>
                <p class="name">{{item.name}}</p>
              </router-link>
            </li>
            <li class="item">
              <router-link :to="{path: `/train/taglist`}">
                <p class="icon">
                  <img src="./more.png">
                </p>
                <p class="name">更多</p>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="g-recommend teachers">
          <div class="titlebox red">
            <p class="icon left"><span class="small"></span><span class="big"></span></p>
            <p class="title">名师推荐</p>
            <p class="icon right"><span class="big"></span><span class="small"></span></p>
            <router-link class="more" :to="{path: routerPrefix + '/train/67'}">更多名师</router-link>
          </div>
          <div class="list">
            <swiper :options="swiperOPtsCourse" class="g-swiper">
              <swiper-slide class="swiper-item" v-for="(item, index) in teacherList" :key="index">
                <div class="item" @click="selectTeacher(item)">
                  <p class="avatar">
                    <img :src="item.faceUrl">
                  </p>
                  <p class="name">{{item.nickname}}</p>
                  <p class="pos">{{item.career}}</p>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="g-recommend course">
          <div class="titlebox green">
            <p class="icon left"><span class="small"></span><span class="big"></span></p>
            <p class="title">课程推荐</p>
            <p class="icon right"><span class="big"></span><span class="small"></span></p>
          </div>
          <ul class="list">
            <course-item :course="item" v-for="(item, index) in courseList" :key="index" @selectcourse="selectcourse"></course-item>
          </ul>
          <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : noResult}}</p>
        </div>
      </div>
    </scroll>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { getTrainHomeContainer, listRecommendTeachers, listBanners, listRecommendCourses } from 'api/train';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import CourseItem from 'base/course-item/course-item';
  import NoResult from 'base/no-result/no-result';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '培训',
        routerPrefix: util.routerPrefix,
        swiperOPts: {
          loop: true,
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
        swiperOPtsCourse: {
          freeMode: true,
          loop: false,
          slidesPerView: 3,
          spaceBetween: 10,
          autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          }
        },
        bannerList: null,
        tagList: null,
        teacherList: null,
        courseList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        coursePage: 1
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this._listBanners().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.bannerList = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._getTrainHomeContainer().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.tagList = res.result.tagList;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this._listRecommendTeachers().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.teacherList = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
      this.requestCourses();
    },
    mounted () {
    },
    methods: {
      selectTeacher (teacher) {
        this.$router.push({
          path: `/train/teacherdetail/${teacher.id}`
        });
      },
      selectcourse (course) {
        this.$router.push({
          path: `/train/${course.id}`
        });
      },
      requestCourses () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listRecommendCourses(this.coursePage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.courseList) {
                  this.courseList = this.courseList.concat(res.result);
                } else {
                  this.courseList = res.result;
                }
                this.coursePage = this.coursePage + 1;
              } else {
                this.noMore = true;
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
      _getTrainHomeContainer () {
        var param = {
          productGuid: this.productGuid
        };
        return getTrainHomeContainer(param);
      },
      _listRecommendTeachers () {
        var param = {
          productGuid: this.productGuid
        };
        return listRecommendTeachers(param);
      },
      _listBanners () {
        var param = {
          productGuid: this.productGuid
        };
        return listBanners(param);
      },
      _listRecommendCourses (page) {
        var param = {
          productGuid: this.productGuid,
          page: page
        };
        return listRecommendCourses(param);
      }
    },
    watch: {
      tagList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      teacherList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      courseList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      Confirm,
      TopTip,
      Loading,
      Scroll,
      CourseItem,
      NoResult
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train";

</style>

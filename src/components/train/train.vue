<template>
  <div class="g-train">
    <scroll ref="scroll" class="train-content" :data="bannerList">
      <div>
        <!--<header class="g-header">-->
        <!--<HeaderTitle :title="pageTitle"></HeaderTitle>-->
        <!--</header>-->
        <div class="chunk g-banner" v-if="bannerList">
          <swiper :options="swiperOPts" class="g-swiper">
            <swiper-slide v-for="(item, index) in bannerList" :key="index">
              <img :src="item.coverUrl" @click="bannerClick(item)">
            </swiper-slide>
            <div class="swiper-pagination swiper-pagination-banner" slot="pagination"></div>
          </swiper>
        </div>
        <div class="chunk g-tagList" v-if="tagList">
          <ul class="list">
            <li class="item" v-for="(item, index) in tagList" :key="index">
              <router-link :to="{path: `/train/all/tagdetail/${item.id}`}">
                <p class="icon">
                  <img :src="item.bgUrl">
                </p>
                <p class="name">{{item.name}}</p>
              </router-link>
            </li>
            <li class="item">
              <router-link :to="{path: `/train/all/taglist`}">
                <p class="icon">
                  <img src="./more.png">
                </p>
                <p class="name">更多</p>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="chunk g-recommend teachers">
          <div class="titlebox">
            <p class="title">导师推荐</p>
            <!--<router-link class="more" :to="{path: '/train/all/teacherlist'}">更多 <i-->
              <!--class="icon c-icon-angle-right"></i></router-link>-->
          </div>
          <div class="list">
            <swiper :options="swiperOPtsCourse" class="g-swiper">
              <swiper-slide class="swiper-item" v-for="(item, index) in teacherList" :key="index">
                <div class="item" @click="selectTeacher(item)">
                  <p class="avatar">
                    <img v-lazy="item.faceUrl">
                  </p>
                  <p class="name">{{item.nickname}}</p>
                  <p class="pos">{{item.career}}</p>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="chunk g-recommend course">
          <div class="titlebox">
            <p class="title">课程推荐</p>
            <!--<router-link class="more" :to="{path: '/train/all/courselist'}">更多 <i-->
              <!--class="icon c-icon-angle-right"></i></router-link>-->
          </div>
          <ul class="list">
            <course-item :course="item" v-for="(item, index) in courseList" :key="index"
                         @selectcourse="selectcourse"></course-item>
          </ul>
          <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : noResult}}</p>
        </div>
        <div class="chunk g-recommend course aggregation">
          <div class="titlebox">
            <p class="title">课程合辑</p>
            <!--<router-link class="more" :to="{path: '/train/all/courselist', query:{type: 'aggregation'}}">更多-->
            <!--<i class="icon c-icon-angle-right"></i></router-link>-->
          </div>
          <ul class="list">
            <course-item :course="item" v-for="(item, index) in courseAggregationList" :key="index"
                         @selectcourse="selectCourseAggregation"></course-item>
          </ul>
          <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : noResult}}</p>
        </div>
        <div class="chunk g-recommend like">
          <div class="titlebox">
            <p class="title">猜你喜欢</p>
          </div>
          <ul class="list">
            <course-item :course="item" v-for="(item, index) in courseLiveList" :key="index"
                         @selectcourse="selectLike"></course-item>
          </ul>
          <p class="request-result refresh"><i @click="getCourseLiveList" class="icon c-icon-fresh"></i><span
            @click="getCourseLiveList">换一换</span></p>
        </div>
      </div>
    </scroll>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
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
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import {
    getTrainHomeContainer,
    listRecommendTeachers,
    listBannersByLocationType,
    listRecommendCourses,
    listCoursesForYouWant
  } from 'api/train';
  import { listRecommendCoursePackage } from 'api/coursePackage';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import CourseItem from 'base/course-item/course-item';
  import NoResult from 'base/no-result/no-result';

  export default {
    name: 'studyTrainAll',
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        keepAliveList: ['studyTagList', 'studyTeacherList'],
        isRouterAlive: true,
        toptipTxt: '',
        pageTitle: '培训',
        routerPrefix: util.routerPrefix,
        swiperOPts: {
          slideToClickedSlide: true,
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
        courseAggregationList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        coursePage: 1,
        courseLiveList: null
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
//            this.initData();
    },
    activated () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.initData();
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    mounted () {
    },
    methods: {
      initData () {
        this._listBannersByLocationType().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.bannerList = res.result;
          }
        }).catch(erro => {
          console.log(erro);
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
        // 请求分类
//        this._getTrainHomeContainer().then((res) => {
//          if (res.code) {
//            if (res.code != ERR_OK) {
//              return Promise.reject(res);
//            }
//            this.tagList = res.result.tagList;
//          }
//        }).catch(erro => {
//          this.toptipTxt = erro.message;
//          this.$refs.toptip.show();
//        });
        this._listRecommendTeachers().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.teacherList = res.result;
          }
        }).catch(erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
        this._listRecommendCourses(1, 2, 3).then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.courseAggregationList = res.result;
          }
        }).catch(erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
        this.getCourseLiveList();
        this.requestScrollData();
      },
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      getCourseLiveList () {
        this._listCoursesForYouWant().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.courseLiveList = res.result;
          }
        }).catch(erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      selectBanner (item, index) {
        console.log(item);
        var type = item.type;
        var url = '';
        switch (type) {
          case 1:
            url = `/info/detail/${item.id}`;
            break;
          case 2:
            url = `/activity/detail/${item.id}`;
            break;
          case 3:
            url = `/train/all/${item.id}`;
            break;
          case 4:
            url = `/train/all/teacherdetail/${item.id}`;
            return;
          case 5:
            window.location.href = JSON.parse(item.params).url;
            break;
        }
        this.$router.push({
          path: url
        });
      },
      selectTeacher (teacher) {
        this.$router.push({
          path: `/train/all/teacherdetail/${teacher.id}`
        });
      },
      selectcourse (course) {
        this.$router.push({
          path: `/train/all/${course.id}`
        });
      },
      selectLike (data) {
        if (data.stype === 1) {
            this.selectcourse(data);
        } else {
          this.selectCourseAggregation(data);
        }
      },
      selectCourseAggregation (course) {
        this.$router.push({
          path: `/train/all/${course.id}`,
          query: {
            type: 'aggregation'
          }
        });
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listRecommendCourses(this.coursePage, 1, 10).then((res) => {
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
      bannerClick (data) {
        /**
         * banner type: 1.资讯 2.活动 3.课程 4.网页 5. 老师
         */
        var params = JSON.parse(data.params);
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
          case 5:
            this.$router.push({
              path: `/train/all/teacherdetail/${params.id}`
            });
            break;
          case 4:
            window.open(params.url);
            break;
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
      _listBannersByLocationType () {
        var param = {
          productGuid: this.productGuid,
          type: 3,
          userGuid: this.userGuid
        };
        return listBannersByLocationType(param);
      },
      _listCoursesForYouWant () {
        var param = {
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        return listCoursesForYouWant(param);
      },
      _listRecommendCourses (page, stype, limitSize) {
        var param = {
          productGuid: this.productGuid,
          page: page,
//          limitFlag: false,
          limitSize: limitSize,
          version: 3
        };
        if (stype) {
          param.stype = stype;
        }
        var privateConfig = {
          concurrent: true
        };
        return listRecommendCourses(param, privateConfig);
      },
      _listRecommendCoursePackage (page) {
        var param = {
          page: page,
          limitSize: 3
        };
        return listRecommendCoursePackage(param);
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

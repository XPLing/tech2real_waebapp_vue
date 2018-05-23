<template>
  <transition name="slide">
    <div class="g-teacher-detail">
      <header class="g-header">
        <HeaderTitle v-if="hideTeacher" :title="pageTitle" :has-back="true"></HeaderTitle>
        <div class="big-header" ref="bigHeader">
          <p class="icon">
            <i class="fa fa-angle-left left" @click="back" aria-hidden="true"></i>
          </p>
        </div>
      </header>
      <div class="teacher-info" v-if="teacherIntro">
        <div class="avatar">
          <img :src="teacherIntro.faceUrl">
        </div>
        <div class="detail">
          <p class="name">{{teacherIntro.realName}}</p>
          <p class="career">{{teacherIntro.career}}</p>
        </div>
      </div>
      <div class="g-main" ref="main">
        <scroll ref="scroll" :pullup="true" :data="courseList" @scrollToEnd="requestCourses" :probeType="probeType"
                :listenScroll="listenScroll"
                @pullingUp="requestCourses" @scroll="scrollHandle">
          <div>

            <div class="g-intro" v-if="teacherIntro">
              <div class="item">
                <p class="title">工业应用</p>
                <div class="brief">
                  <pre>{{teacherIntro.brief}}</pre>
                </div>
              </div>
              <div class="item">
                <p class="title">课程方向</p>
                <div class="brief">
                  <pre>{{teacherIntro.courseBrief}}</pre>
                </div>
              </div>
            </div>
            <div class="g-course course" v-if="courseList && courseList.length>0">
              <ul class="list">
                <course-item :course="item" v-for="(item, index) in courseList" :key="index"
                             @selectcourse="selectcourse"></course-item>
              </ul>
              <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : loadingMore}}</p>
            </div>
            <div v-else>
              <no-result :title="noResult"></no-result>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <router-view></router-view>
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
  import { listCoursesByTeacherId, getTeacherById } from 'api/train';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import CourseItem from 'base/course-item/course-item';
  import NoResult from 'base/no-result/no-result';

  const NAV_HEIGHT = util.common.calculateWH(40);
  const MAIN_TOPTOLERANCE = util.common.calculateWH(20);
  const BIGHEADER_HEIGHT = util.common.calculateWH(127);
  const transform = util.common.cssPrefix('transform');
  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '导师详情',
        courseList: null,
        requestMoreFlag: false,
        noMore: false,
        loadingMore: '加载中。。。',
        noMoreStr: '没有更多了~',
        coursePage: 1,
        teacherId: 0,
        teacherIntro: null,
        noResult: '暂无课程~~',
        hideTeacher: false,
        probeType: 3,
        listenScroll: true,
        scrollY: 0
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this.minY = BIGHEADER_HEIGHT - NAV_HEIGHT;
      this.teacherId = this.$route.params.id;
      this._getTeacherById().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.teacherIntro = res.result;
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
      scrollHandle (pos) {
        this.scrollY = pos.y;
      },
      back () {
        this.$router.back();
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
          this._listCoursesByTeacherId(this.coursePage).then((res) => {
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
      _listCoursesByTeacherId (page) {
        var param = {
          productGuid: this.productGuid,
          id: this.teacherId,
          page: page
        };
        return listCoursesByTeacherId(param);
      },
      _getTeacherById (page) {
        var param = {
          productGuid: this.productGuid,
          id: this.teacherId,
          page: page
        };
        return getTeacherById(param);
      }
    },
    watch: {
      scrollY (newVal) {
        if (newVal < -this.minY) {
          return;
        }
        var bigHeaderDom = this.$refs.bigHeader;
        var mainDom = this.$refs.main;
        var mainTop = mainDom.offsetTop;
        var bigHeaderH = bigHeaderDom.offsetHeight;
        var newBigHeaderH = bigHeaderH + newVal;
        var newmainTop = mainTop + newVal;
        if (newBigHeaderH < NAV_HEIGHT) {
          newBigHeaderH = NAV_HEIGHT;
        }
        if (newBigHeaderH > BIGHEADER_HEIGHT) {
          newBigHeaderH = BIGHEADER_HEIGHT;
        }
        console.log(newmainTop);
        if (newmainTop < NAV_HEIGHT) {
          newmainTop = NAV_HEIGHT;
        }
        if (newmainTop > BIGHEADER_HEIGHT + MAIN_TOPTOLERANCE) {
          newmainTop = BIGHEADER_HEIGHT + MAIN_TOPTOLERANCE;
        }
        bigHeaderDom.style.height = `${newBigHeaderH}px`;
        mainDom.style.top = `${newmainTop}px`;
      },
      teacherIntro () {
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
  @import "./teacher-detail";

</style>

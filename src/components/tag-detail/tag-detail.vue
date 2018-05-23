<template>
  <transition name="slide">
    <div class="g-tag-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll" class="tag-detail-content" :pullup="true" :data="courseList" @scrollToEnd="requestCourses"
                @pullingUp="requestCourses">
          <div>
            <div class="g-intro" v-if="courseIntro">
              <p class="title">{{courseIntro.name}}</p>
              <div class="brief">
                <pre>{{courseIntro.brief}}</pre>
              </div>
            </div>
            <div class="g-course course" v-if="courseList && courseList.length>0">
              <ul class="list">
                <course-item :course="item" v-for="(item, index) in courseList" :key="index" @selectcourse="selectcourse"></course-item>
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
  import { listCoursesByTagId, getTagByTagId } from 'api/train';
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
        pageTitle: '分类详情',
        courseList: null,
        requestMoreFlag: false,
        noMore: false,
        loadingMore: '加载中。。。',
        noMoreStr: '没有更多了~',
        coursePage: 1,
        tagId: 0,
        courseIntro: null,
        noResult: '暂无课程~~'
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this.tagId = this.$route.params.id;
      this._getTagByTagId().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.courseIntro = res.result;
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
          this._listCoursesByTagId(this.coursePage).then((res) => {
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
      _listCoursesByTagId (page) {
        var param = {
          productGuid: this.productGuid,
          id: this.tagId,
          page: page
        };
        return listCoursesByTagId(param);
      },
      _getTagByTagId (page) {
        var param = {
          productGuid: this.productGuid,
          id: this.tagId,
          page: page
        };
        return getTagByTagId(param);
      }
    },
    watch: {
      courseIntro () {
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
  @import "./tag-detail";

</style>

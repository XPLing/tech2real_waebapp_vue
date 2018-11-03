<template>
  <transition name="slide">
    <div class="g-tag-list">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll" class="tag-detail-content" :data="scrollDataList" :pullup="true"
                @pullingUp="requestScrollData">
          <div>
            <div class="g-course">
              <ul class="list">
                <course-item :course="item" v-for="(item, index) in scrollDataList" :key="index"
                             @selectcourse="selectcourse"></course-item>
              </ul>
              <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : loadingMore}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { listRecommendCourses } from 'api/train';
  import { listCoursePackage } from 'api/coursePackage';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import CourseItem from 'base/course-item/course-item';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '课程列表',
        scrollDataList: null,
        requestMoreFlag: false,
        noMore: false,
        loadingMore: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        noResult: '暂无课程~~',
        defaultAvatar: require('assets/image/defaultAvatar.png')
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this.listType = this.$route.query ? this.$route.query.type : '';
      this.requestScrollData();
    },
    mounted () {
    },
    methods: {
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          var fnName = '_listRecommendCourses', dataName = '';
          if (this.listType === 'aggregation') {
            fnName = '_listCoursePackage'
          }
          this[fnName](this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.scrollDataList) {
                  this.scrollDataList = this.scrollDataList.concat(res.result);
                } else {
                  this.scrollDataList = res.result;
                }
                this.requestPage = this.requestPage + 1;
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
      selectcourse (course) {
        var opt = {
          path: `/train/all/${course.id}`
        };
        if (this.listType === 'aggregation') {
          opt.query = {
            aggregation: true
          }
        }
        this.$router.push(opt);
      },
      _listRecommendCourses (page) {
        var param = {
          productGuid: this.productGuid,
          page: page
        };
        return listRecommendCourses(param);
      },
      _listCoursePackage (page) {
        var param = {
          productGuid: this.productGuid,
          page: page
        };
        return listCoursePackage(param);
      }
    },
    watch: {
      scrollDataList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      HeaderTitle,
      TopTip,
      Scroll,
      CourseItem
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./courselist";

</style>

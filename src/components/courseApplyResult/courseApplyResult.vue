<template>
  <transition name="slide">
    <div class="g-course-apply-result">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="g-main-wrapper">
        <scroll :data="courseData" ref="scroll">
          <div class="g-scroll-continer">
            <div class="course-base">
              <p class="header-bg"></p>
              <div class="price"></div>
              <div class="intro">
                <course-list :course-list="courseList" v-if="courseList.length>0"
                             @selectcourse="selectCourse"></course-list>
              </div>
            </div>
            <div class="course-detail">
              <p class="title">详细信息</p>
              <p class="time">{{ new Date().getTime() | formatDate('yyyy-MM-dd')}}</p>
            </div>


          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import CourseList from 'base/course-list/course-list';
  import Scroll from 'base/scroll/scroll';
  import * as util from 'assets/js/util';
  export default {
    props: {
      courseData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageTitle: '报名详情',
        hasBack: true,
        routerPrefix: util.routerPrefix
      };
    },
    computed: {
      courseList () {
        var list = [];
        if (this.courseData) {
          list.push(this.courseData.courseResult.result);
        }
        return list;
      }
    },
    methods: {
      selectCourse (courseID) {
        this.$router.push({
          path: `${this.routerPrefix}/train/${courseID}`
        });
      }
    },
    components: {
      HeaderTitle,
      CourseList,
      Scroll
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "courseApplyResult";
</style>

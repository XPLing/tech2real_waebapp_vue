<template>
  <transition name="slide">
    <div class="g-course-apply-infocollect">

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
        this.$router.back();
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
  @import "courseApplyInfoCollect";
</style>

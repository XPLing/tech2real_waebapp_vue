<template>
  <div class="g-course-chapters">
    <scroll :data="courseData" ref="scroll">
      <div class="chapters g-scroll-continer">
        <div class="chapter-item" :class="{ 'active': chapters.isCollapsed}" v-if="courseChapters.length>0"
             v-for="(chapters,index) in courseChapters" :key="index">
          <div class="title" @click.stop="chaptersCollapse(chapters,index,$event)">
            {{chapters.title}}
            <i class="fa collapsible up"></i>
          </div>
          <ul class="course-list">
            <li class="course-item" v-for="chapter in chapters.chapters" :key="chapter.id">
              <a href="javascript:void(0);" :data-url="chapter.videoUrl"
                 @click.stop="changeVideo(chapter.videoUrl,$event)">
                <i class="fa fa-caret-square-o-right"></i><em>{{chapter.title}}</em>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="!courseChapters.length">
        <no-result :title="noResult"></no-result>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import { commonVariable, ERR_OK } from 'api/config';
  import { getUserGuid, getProductGuid } from 'assets/js/common';
  export default {
    props: {
      courseData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        id: 0,
        isSetData: false,
        userGuid: getUserGuid(),
        productGuid: getProductGuid()
      };
    },
    created () {
      this.noResult = '暂无课程~~';
      this._getCourseID();
    },
    computed: {
      courseChapters () {
        var chapters = [];
        if (this.courseData) {
          if (!this.isSetData) {
            this.isSetData = true;
            chapters = this.courseData.chapterResult.result;
            var len = chapters.length;
            if (len > 0) {
              for (var i = 0; i < len; i++) {
                var chapter = chapters[i];
                this.$emit('setdata', 'isCollapsed', true, i, 'chapterResult');
              }
            }
          }
        }
        return chapters;
      }
    },
    methods: {
      _getCourseID () {
        this.id = this.$route.params.id;
      },
      chaptersCollapse (chapters, index, event) {
        chapters.isCollapsed = !chapters.isCollapsed;
      },
      changeVideo (url) {
        this.$emit('changevideo', url);
      }
    },
    components: {
      Scroll,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./course-chapters";
</style>

<template>
  <div class="g-course-chapters" :class="{'joined':this.appliedState>0}">
    <scroll :data="chapterData" ref="scroll">
      <div class="g-package c-form-item" ref="package" @click.stop="showSelect">
        <p class="form-left">课程</p>
        <p class="form-body">{{currentPackage}}</p>
        <p class="form-right">
          <i class="icon c-icon-angle-right"></i>
        </p>
      </div>
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
                 @click.stop="changeVideo(chapter,$event)">
                <i class="fa fa-caret-square-o-right"></i><em>{{chapter.title}}</em>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="g-select-box">
        <g-select :select-data="selectOpts" :current-select="currentSelect" ref="select"
                  @select="selectItem" @clickMask="clickMask"></g-select>
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
  import { ERR_OK } from 'api/config';
  import { mapGetters } from 'vuex';
  import Select from 'base/select/select';
  import communication from 'assets/js/communication';

  export default {
    props: {
      chapterData: {
        type: [Object, Array],
        default: null
      },
      appliedState: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        id: 0,
        isSetData: false,
        selectOpts: [
          {
            'title': '课程1'
          },
          {
            'title': '课程2'
          },
          {
            'title': '课程3'
          },
          {
            'title': '课程4'
          }
        ],
        currentSelect: -1,
        chapters: [],
        currentPackage: '注册供应商质量经理课程经理课程程经理课程程经理课程'
      };
    },
    created () {
      communication.$on('clickMask', (vm) => {
        vm.$refs.select.hide();
        communication.$emit('hideGlobalMask', this.$parent);
      });
      this.noResult = '暂无课程~~';
      this._getCourseID();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ]),
      courseChapters () {
        if (this.chapterData) {
          if (!this.isSetData) {
            this.isSetData = true;
            this.chapters = this.chapterData;
            var len = this.chapters.length;
            if (len > 0) {
              for (var i = 0; i < len; i++) {
                var chapter = this.chapters[i];
                this.$emit('setdata', 'isCollapsed', true, i, 'chapterResult');
              }
            }
          }
        }
        return this.chapters;
      }
    },
    methods: {
      clickMask () {
        communication.$emit('hideGlobalMask', this.$parent);
      },
      showSelect () {
        communication.$emit('showGlobalMask', this.$parent);
        this.$refs.select.show();
      },
      selectItem (item, index) {
        this.currentSelect = index;
        this.currentPackage = item.title;
        communication.$emit('hideGlobalMask', this.$parent);
      },
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
      NoResult,
      'g-select': Select
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "~assets/scss/propertype";
  @import "./course-chapters";
</style>

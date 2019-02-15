<template>
  <div class="g-course-chapters" :class="{'joined':this.appliedState===1}">
    <scroll :data="chapterData" ref="scroll">
      <div class="g-scroll-continer">
        <div v-if="this.aggregationOpts && this.aggregationOpts.length > 0" class="g-package c-form-item" ref="package"
             @click.stop="showSelect">
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
                  <p class="title">
                    <i class="fa type"
                       :class="{'c-icon-play': chapter.type===1 ||chapter.type===2, 'c-icon-word': chapter.type===3}"></i>
                    <em class="cont">{{chapter.title}}</em>
                    <i class="fa c-icon-course_lock_icon" v-if="!(appliedState == 1 || chapter.isFree)"></i>
                    <em class="try" v-if="chapter.isFree">试看</em>
                  </p>
                  <template v-if="chapter.type===4 && (appliedState == 1 || chapter.isFree)">
                    <div class="detail">
                      <p class="icon"
                         v-if="(chapter.type==4&&( chapter.infoFlag.startTimeFlag|| chapter.infoFlag.endTimeFlag|| chapter.infoFlag.addressFlag))||chapter.type!=4">
                        <i class="c-icon-position"></i>
                      </p>
                      <template v-if="chapter.type==4">
                        <div class="info">
                          <p v-if="chapter.startTime && chapter.infoFlag.startTimeFlag" class="time">
                            开始时间：{{chapter.startTime | formatDate('yyyy-MM-dd')}}</p>
                          <p v-if="chapter.endTime && chapter.infoFlag.endTimeFlag" class="time">
                            结束时间：{{chapter.endTime | formatDate('yyyy-MM-dd')}}</p>
                          <p v-if="chapter.province && chapter.infoFlag.addressFlag" class="address">
                            地址：{{chapter.province + chapter.city + chapter.district}}</p>
                        </div>
                      </template>
                      <template v-else>
                        <div class="info">
                          <p v-if="chapter.startTime" class="time">
                            开始时间：{{chapter.startTime | formatDate('yyyy-MM-dd')}}</p>
                          <p v-if="chapter.endTime" class="time">
                            结束时间：{{chapter.endTime | formatDate('yyyy-MM-dd')}}</p>
                          <p v-if="chapter.province" class="address">
                            地址：{{chapter.province + chapter.city + chapter.district}}</p>
                        </div>
                      </template>

                    </div>
                  </template>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div v-show="!courseChapters.length">
          <no-result :title="noResult"></no-result>
        </div>
      </div>
    </scroll>
    <div class="g-select-box">
      <g-select :select-data="aggregationOpts" :current-select="currentSelect" ref="select"
                @select="selectItem" @clickMask="clickMask"></g-select>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import { ERR_OK } from 'api/config';
  import { mapGetters } from 'vuex';
  import Select from 'base/select/select';
  import communication from 'assets/js/communication';

  /**
   * chapterData.type
   * 章节类型  1:视频，  2:点播， 3:教材， 4:线下授课
   */
  export default {
    props: {
      chapterData: {
        type: [Object, Array],
        default: null
      },
      appliedState: {
        type: Number,
        default: 0
      },
      aggregationOpts: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        id: 0,
        isSetData: false,
        selectOpts: [],
        currentSelect: 0,
        chapters: [],
        currentPackage: '',
        aggregation: null
      };
    },
    created () {
      this.aggregation = this.$route.query.type === 'aggregation';
      if (this.aggregationOpts && this.aggregationOpts.length > 0) {
        this.currentPackage = this.aggregationOpts[this.currentSelect].title;
      }
      communication.$on('clickMask', (vm) => {
        vm.$refs.select.hide();
        communication.$emit('hideGlobalMask', this.$parent);
      });
      this.noResult = '暂无课程~~';
      this._getCourseID();
    },
    activated () {
//      if (!this.$route.meta.isBack || this.isFirstEnter) {
//      }
//      this.$route.meta.isBack = false;
//      this.isFirstEnter = false;
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ]),
      courseChapters () {
        if (this.chapterData) {
          if (!this.isSetData || this.aggregation) {
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
        } else {
          this.chapters = [];
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
        this.$emit('selectAggregation', item);
      },
      _getCourseID () {
        this.id = this.$route.params.id;
      },
      chaptersCollapse (chapters, index, event) {
        chapters.isCollapsed = !chapters.isCollapsed;
      },
      changeVideo (chapter) {
        this.$emit('changevideo', chapter);
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

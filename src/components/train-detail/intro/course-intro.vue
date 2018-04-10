<template>
  <div class="g-course-intro" :class="{'joined':this.appliedState>0}">
    <scroll :data="courseIntro" :refreshDelay="refreshDelay" ref="scroll" @scroll="descImage" :probeType="probeType"
            :listenScroll="listenScroll">
      <div class="g-scroll-continer">
        <div class="section base-info" v-if="courseIntro">
          <h1 class="title">{{courseIntro.title}}</h1>
          <p class="info">报名人数{{courseIntro.applyCount}} | {{courseIntro.evaluateCount}}人评论</p>
          <p class="price green">{{courseIntro.price === 0 ? "免费" : courseIntro.price}}</p>
        </div>
        <div class="section detail-info" v-if="courseIntro">
          <div class="detail-info-item teacher">
            <h2 class="title">讲师</h2>
            <ul>
              <li class="list">
                <a href="javascript:void(0);" class="c-media">
                  <div class="avatar">
                    <img :src="courseIntro.teachers[0].faceUrl">
                  </div>
                  <div class="desc">
                    <p class="title">{{courseIntro.teacherNames}}</p>
                    <p class="info career">{{courseIntro.teachers[0].career}}</p>
                    <p class="info" v-html="courseIntro.teachers[0].brief"></p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div class="detail-info-item course-intro">
            <h2 class="title">课程介绍</h2>
            <div class="desc" v-html="courseIntro.brief" ref="desc"></div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { imgOnload } from 'assets/js/imgOnload';
  import Scroll from 'base/scroll/scroll';
  import { getCourseIntro } from 'api/courseDetail';
  import { ERR_OK } from 'api/config';
  import { mapGetters, mapMutations } from 'vuex';
  export default {
    props: {
      courseData: {
        type: Object,
        default: null
      },
      appliedState: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        id: null,
        refreshDelay: 20,
        probeType: 2,
        listenScroll: true
      };
    },
    created () {
      this._getCourseID();
    },
    mounted () {
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'productGuid',
        'userGuid'
      ]),
      courseIntro () {
        return this.courseData && this.courseData.courseResult.result;
      }
    },
    watch: {},
    methods: {
      _getCourseID () {
        this.id = this.$route.params.id;
      },
      descImage () {
        if (!this.descImageLoaded) {
          var imgs = this.$refs.desc.querySelectorAll('img');
          if (imgs.length < 0) {
            return;
          }
          imgOnload(imgs, this, 'descImageLoaded', () => {
            this.$refs.scroll.refresh();
          }, () => {
            this.$refs.scroll.scroll.off('scroll');
          });
        }
      }
    },
    components: {
      Scroll
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./course-intro";
</style>

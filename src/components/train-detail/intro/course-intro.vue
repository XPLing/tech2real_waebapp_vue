<template>
  <div class="g-course-intro" :class="{'joined':this.appliedState===1}">
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
            <div class="teacher-list">
              <swiper :options="swiperOPtsTeacher" class="g-swiper">
                <swiper-slide class="swiper-item" v-for="(item,index) in courseIntro.teachers" :key="index">
                  <router-link :to="{path:`/train/all/teacherdetail/${item.id}`}" class="c-media">
                    <div class="avatar">
                      <img :src="item.faceUrl">
                    </div>
                    <div class="desc">
                      <p class="title">{{item.realName}}</p>
                      <p class="info career">{{item.career}}</p>
                    </div>
                  </router-link>
                </swiper-slide>
              </swiper>
            </div>
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
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
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
        listenScroll: true,
        introImgs: [],
        loadedImgs: [],
        imgsLoadStatus: 'ready',
        swiperOPtsTeacher: {
          freeMode: true,
          loop: false,
          slidesPerView: 2.5,
          spaceBetween: 10
        }
      };
    },
    created () {
      this._getCourseID();
    },
    mounted () {
      this.$nextTick(() => {
        if (this.$refs.desc) {
          this.introImgs = [];
          var nodelist = this.$refs.desc.querySelectorAll('img');
          for (var i = 0, len = nodelist.length; i < len; i++) {
            this.introImgs.push(nodelist[i]);
          }
        }
      });
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'productGuid',
        'userGuid'
      ]),
      courseIntro () {
        return this.courseData;
      },
      loadingImgs () {
        var arr = [];
        if (this.loadedImgs.length > 0) {
          for (var i = 0, len = this.introImgs.length; i < len; i++) {
            var item = this.introImgs[i];
            for (var j = 0, jlen = this.loadedImgs.length; j < jlen; j++) {
              var jitem = this.loadedImgs[i];
              if (jitem !== item) {
                arr.push(item);
              }
            }
          }
        } else {
          arr = this.introImgs;
        }
        return arr;
      }
    },
    watch: {
      courseIntro () {
        this.$nextTick(() => {
          this.introImgs = [];
          var nodelist = this.$refs.desc.querySelectorAll('img');
          for (var i = 0, len = nodelist.length; i < len; i++) {
            this.introImgs.push(nodelist[i]);
          }
        });
      }
    },
    methods: {
      _getCourseID () {
        this.id = this.$route.params.id;
      },
      descImage () {
        if (this.loadingImgs.length > 0 && this.imgsLoadStatus === 'ready') {
          var imgs = this.loadingImgs;
          this.imgsLoadStatus = 'loading';
          if (imgs.length < 0) {
            this.imgsLoadStatus = 'loaded';
            return;
          }
          Promise.all(imgOnload(imgs, this, 'descImageLoaded')).then((res) => {
            this.imgsLoadStatus = 'loaded';
            this.loadedImgs = res;
            this.$nextTick(() => {
              this.$refs.scroll.refresh();
            });
//            if (res.loaded.length === this.introImgs.length) {
//              // this.$refs.scroll.scroll.off('scroll');
//            }
          }).catch(() => {
            this.imgsLoadStatus = 'error';
            this.confirmTxt = '网络出错请重新加载！';
            this.$refs.confirmsWrapper.show();
          });
        } else {
          // this.$refs.scroll.scroll.off('scroll');
        }
      }
    },
    components: {
      Scroll,
      swiper,
      swiperSlide
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./course-intro";
</style>

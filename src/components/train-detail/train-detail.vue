<template>
  <transition name="slide">
    <div class="g-train-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-search="hasSearch" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="g-video">
        <div v-if="videoUrl" class="video-wrapper">
          <video controls :src="videoUrl" ref="video"></video>
          <p class="video-mask" v-show="isPause" @click.stop="Vclick">
            <i class="fa" :class="{'fa-spin fa-circle-o-notch': !isCanplay,'fa-play-circle':isCanplay}"></i>
          </p>
        </div>
        <img v-if="courseData && courseData.chapterResult.result.length <= 0" :src="coverUrl">
      </div>
      <nav class="g-nav-wrapper">
        <TrainDetailTab></TrainDetailTab>
      </nav>
      <div class="g-main" :class="{'joined':this.appliedState>0}">
        <keep-alive>
          <router-view :product-guid="productGuid" :user-guid="userGuid" :course-data="courseData"
                       @setdata="setDatas" @changevideo="changeVideo"></router-view>
        </keep-alive>
      </div>
      <div class="g-join" v-if="courseData && this.appliedState<=0">
        <span
          class="price">{{courseData.courseResult.result.price == 0 ? "免费" : courseData.courseResult.result.price}}</span>
        <button class="btn" @click="join">加入学习</button>
      </div>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import Confirm from 'base/confirm/confirm';
  import TrainDetailTab from 'components/train-detail-tab/train-detail-tab';
  import { getCourseData } from 'api/courseDetail';
  import { ERR_OK } from 'api/config';
  import { mapGetters, mapMutations } from 'vuex';

  const LOGINTIP = '请先登录!';
  const JOINTIP = '是否加入课程开始学习?';

  export default {
    props: {},
    data () {
      return {
        courseID: 0,
        pageTitle: '课程详情',
        hasSearch: false,
        hasBack: true,
        courseData: null,
        videoUrl: null,
        coverUrl: null,
        appliedState: null,
        isPause: true,
        isCanplay: false
      };
    },
    computed: {
      confirmTxt () {
        return this.userGuid ? JOINTIP : LOGINTIP;
      },
      ...mapGetters([
        'userInfo',
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this._getCourseID();
      this._getCourseData();
      console.log(this.userGuid);
    },
    methods: {

      _getCourseID () {
        this.courseID = this.$route.params.id;
      },
      _getCourseData () {
        var param = {
          id: this.courseID,
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        getCourseData(param).then((res) => {
          if (res.code === ERR_OK) {
            this.courseData = res;
            this.videoUrl = res.chapterResult.result.length > 0 ? res.chapterResult.result[0].chapters[0].videoUrl : null;
            this.coverUrl = res.courseResult.result.coverUrl;
            this.appliedState = res.courseResult.result.appliedState;
          }
        });
      },
      setDatas (key, val, index, dataName) {
        this.$set(this.courseData.chapterResult.result[index], key, val);
      },
      changeVideo (url) {
        if (url === this.videoUrl) {
          return;
        }
        this.isCanplay = false;
        this.videoUrl = url;
      },
      Vclick () {
        if (this.appliedState <= 0) {
          this.join();
          return;
        }
        if (this.isCanplay) {
          this.isPause = false;
          this.Vplay();
        }
      },
      Vplay () {
        this.$refs.video.play();
      },
      Vpause () {
        this.$refs.video.pause();
      },
      join () {
        this.$refs.confirmsWrapper.show();
      },
      confirm () {
        if (this.confirmTxt === JOINTIP) {
          this.appliedState = 1;
        } else {
          this.$router.push({
            path: '/user/login'
          });
        }
      },
      cancel () {
        if (this.confirmTxt === JOINTIP) {
          console.log(JOINTIP);
        } else {
          console.log(LOGINTIP);
        }
      }
    },
    components: {
      HeaderTitle,
      TrainDetailTab,
      Confirm
    },
    watch: {
      videoUrl () {
        setTimeout(() => {
          this.$refs.video.addEventListener('canplay', () => {
            this.isCanplay = true;
          });
        }, 20);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train-detail";

</style>

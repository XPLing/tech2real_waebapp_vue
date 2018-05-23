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
      <div class="g-main">
        <keep-alive>
          <router-view :applied-state="appliedState" :course-data="courseData" :apply-result="applyResult"
                       @setdata="setDatas" @changevideo="changeVideo" @changeapplyres="changeApplyResult"></router-view>
        </keep-alive>
      </div>
      <div class="g-join" v-if="courseData && (!userGuid ||this.appliedState<=0)">
        <span
          class="price">{{courseData.courseResult.result.price == 0 ? "免费" : courseData.courseResult.result.price}}</span>
        <button class="btn" @click="operate">{{courseStateStr}}</button>
      </div>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import TrainDetailTab from 'components/train-detail-tab/train-detail-tab';
  import { getCourseData, applyCourse, getUnpaidCourseApply } from 'api/courseDetail';
  import { ERR_OK } from 'api/config';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import * as util from 'assets/js/util';

  const LOGINTIP = '请先登录!';
  const JOINTIP = '是否加入课程开始学习?';
  const APPLYTIP = {
    LOGINTIP: '请先登录!',
    STATE_APPLY: '是否加入课程开始学习?',
    STATE_BY_COURSE_DETAIL: '课程详情',
    STATE_APPLY_GO_ON: '继续报名',
    STATE_PAY: '立即支付',
    STATE_END: '课程结束',
    STATE_SELL_OUT: '课程售罄',
    STATE_PREPARTING: '准备中'
  };
  const COURSESTATECONFIG = {
    STATE_APPLY: '加入学习',
    STATE_BY_COURSE_DETAIL: '课程详情',
    STATE_APPLY_GO_ON: '继续报名',
    STATE_PAY: '立即支付',
    STATE_END: '课程结束',
    STATE_SELL_OUT: '课程售罄',
    STATE_PREPARTING: '准备中'
  };
  const COURSESTATESTR = [COURSESTATECONFIG.STATE_APPLY, COURSESTATECONFIG.STATE_BY_COURSE_DETAIL, COURSESTATECONFIG.STATE_APPLY_GO_ON,
    COURSESTATECONFIG.STATE_PAY, COURSESTATECONFIG.STATE_END, COURSESTATECONFIG.STATE_SELL_OUT, COURSESTATECONFIG.STATE_PREPARTING];

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
        isCanplay: false,
        toptipTxt: '',
        routerPrefix: util.routerPrefix,
        courseStateStr: '加入学习',
        courseState: 0,
        applyResult: null
      };
    },
    computed: {
      confirmTxt () {
        if (!this.userGuid) {
          return APPLYTIP.LOGINTIP;
        } else {
          for (var key in COURSESTATECONFIG) {
            if (this.courseStateStr == COURSESTATECONFIG[key]) {
              return APPLYTIP[key];
            }
          }
        }
      },
      ...mapGetters([
        'userInfo',
        'productGuid',
        'userGuid'
      ])
    },
    beforeRouteEnter (to, from, next) {
      next((vm) => {
        var $this = vm;
        vm._getCourseData($this);
        return true;
      });
    },
    beforeRouteUpdate (to, from, next) {
      let list = ['applyresult'];
      for (var i = 0, len = list.length; i < len; i++) {
        var reg = list[i];
        if (from.path.indexOf(reg) > -1) {
          this._getCourseData();
          break;
        }
      }
      next();
    },
    created () {
      this._getCourseID();
      // this._getCourseData();
    },
    methods: {
      ...mapMutations({
        updataBeforeLoginPage: 'UPDATA_BEFORELOGINPAGE'
      }),
      _getCourseID () {
        this.courseID = this.$route.params.id;
      },
      _getCourseData ($this) {
        $this = $this || this;
        var param = {
          id: $this.courseID,
          productGuid: $this.productGuid,
          userGuid: $this.userGuid
        };
        getCourseData(param).then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              $this.toptipTxt = res.message;
              $this.$refs.toptip.show();
              return;
            }
          }
          if (res.chapterResult || res.courseResult) {
            $this.courseData = res;
          }
          if (res.chapterResult.code == ERR_OK) {
            $this.videoUrl = res.chapterResult.result.length > 0 ? res.chapterResult.result[0].chapters[0].videoUrl : null;
          }
          if (res.courseResult.code == ERR_OK) {
            let courseResultData = res.courseResult;
            $this.coverUrl = courseResultData.result.coverUrl;
            $this.appliedState = courseResultData.result.appliedState;
            $this.courseState = courseResultData.result.status;
            switch ($this.courseState) {
              case 1:
                $this.courseStateStr = COURSESTATESTR[6];
                break;
              case 3:
                $this.courseStateStr = COURSESTATESTR[4];
                break;
              default:
                if (courseResultData.result.applyTotalCount != 0 && (courseResultData.result.applyTotalCount == courseResultData.result.applyCount)) {
                  $this.courseStateStr = COURSESTATESTR[5];
                } else {
                  $this.courseStateStr = COURSESTATESTR[$this.appliedState];
                }
                break;
            }
          }
        }, erro => {
          $this.toptipTxt = erro.message;
          $this.$refs.toptip.show();
        });
      },
      _applyCourse () {
        let params = {
          id: this.courseID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return applyCourse(params);
      },
      _getUnpaidCourseApply () {
        let params = {
          courseId: this.courseID,
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        return getUnpaidCourseApply(params);
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
      changeApplyResult(res){
        this.applyResult = res;
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
      operate () {
        if (this.courseStateStr == COURSESTATECONFIG.STATE_APPLY || this.courseStateStr == COURSESTATECONFIG.STATE_APPLY_GO_ON) {
          if (this.courseData.courseResult.result.needInfo) {
            this.$router.push({
              path: `${this.routerPrefix}/train/${this.courseID}/applyinfocollect`
            });
          } else {
            this.$refs.confirmsWrapper.show();
          }
        }
        this.$refs.confirmsWrapper.show();

      },
      confirm () {
        if (!this.userGuid) {
          this.updataBeforeLoginPage(this.$route.fullPath);
          this.$router.push({
            path: this.routerPrefix + '/user/login'
          });
          return false;
        }
        if (this.courseStateStr == COURSESTATECONFIG.STATE_APPLY || this.courseStateStr == COURSESTATECONFIG.STATE_APPLY_GO_ON) {
          if (this.courseData.courseResult.result.needInfo) {
            this.applyResult = this.courseData.courseResult;
            this.$router.push({
              path: `${this.routerPrefix}/train/${this.courseID}/applyinfocollect`
            });
          } else {
            this.$refs.loading.show();
            this._applyCourse().then((res) => {
              this.$refs.loading.hide();
              this.applyResult = res.result;
              if (res.code == ERR_OK) {
                this.$router.push({
                  path: `${this.routerPrefix}/train/${this.courseID}/applyresult`
                });
              } else if (res.code == '201') {
                this.$router.push({
                  path: `${this.routerPrefix}/train/${this.courseID}/applypay`
                });
              } else {
                util.common.request.tipMsg(this, res);
              }
            }, erro => {
              this.$refs.loading.hide();
              util.common.request.tipMsg(this, erro);
            });
          }
        } else if (this.courseStateStr == COURSESTATECONFIG.STATE_PAY) {
          this.$refs.loading.show();
          this._getUnpaidCourseApply().then((res) => {
            this.$refs.loading.hide();
            if (res.code == ERR_OK) {
              this.applyResult = res.result;
              this.$router.push({
                path: `${this.routerPrefix}/train/${this.courseID}/applypay`
              });
            } else {
              util.common.request.tipMsg(this, res);
            }
          }, error => {
            this.$refs.loading.hide();
            util.common.request.tipMsg(this, error);
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
      Confirm,
      TopTip,
      Loading
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

<template>
  <transition name="slide">
    <div class="g-train-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-search="hasSearch" :has-back="hasBack" :has-share="true" @share="showShare"></HeaderTitle>
      </header>
      <div class="g-video" v-if="courseData">
        <div v-if="chapterData" class="recourse-wrapper">
          <div v-if="videoUrl" class="video-wrapper">
            <video controls :src="videoUrl" ref="video"></video>
            <p class="video-mask" v-show="isPause" @click.stop="Vclick">
              <i class="fa" :class="{'fa-spin fa-circle-o-notch': !isCanplay,'fa-play-circle':isCanplay}"></i>
            </p>
          </div>
          <a class="file-link" v-else target="_blank" :href="fileUrl">
            <img :src="coverUrl">
          </a>
        </div>
        <img v-else :src="coverUrl">
      </div>
      <nav class="g-nav-wrapper">
        <TrainDetailTab @changeTab="changeTab"></TrainDetailTab>
      </nav>
      <div class="g-main">
        <keep-alive>
          <component v-bind:is="view" :key="`view_${view}`" :applied-state="appliedState" :course-data="courseData" :chapter-data="chapterData"
                     :apply-result="applyResult"
                     @setdata="setDatas" @changevideo="changeVideo" @changeapplyres="changeApplyResult"
                     ref="view">

          </component>
        </keep-alive>
      </div>
      <div class="g-join" ref="join" v-if="courseData && (!userGuid || this.appliedState!=1)">
        <span
          class="price">{{courseData.price == 0 ? "免费" : courseData.price}}</span>
        <button class="btn" @click="operate">{{courseStateStr}}</button>
      </div>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
      <share @cancel="cancelShare" @share="share" ref="share"></share>
      <g-mask @clickMask="clickMask" ref="mask"></g-mask>
      <g-select :title="selectTitle" :select-data="listCourseValidityPeriod" @selectConfirm="selectPeriodConfirm"
                @selectListItem="selectPeriodItem"
                class="g-select-wrapper" ref="selectPeriod">
        <div class="price">
          <p class="real">￥{{coursePrice}}</p>
          <p class="original">原价：<span>¥ {{courseOriginalPrice}}</span></p>
        </div>
      </g-select>
      <router-view :apply-result="applyResult" @updateResult="updateResult"></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import TrainDetailTab from 'components/train-detail-tab/train-detail-tab';
  import CourseIntro from 'components/train-detail/intro/course-intro';
  import CourseChapters from 'components/train-detail/chapters/course-chapters';
  import CourseCommunity from 'components/train-detail/community/course-community';
  import CourseEvaluate from 'components/train-detail/evaluate/course-evaluate';
  import {
    getCourseById,
    listChaptersByCourseId,
    listCourseValidityPeriodByCourseId,
    applyCourse,
    getUnpaidCourseApply
  } from 'api/courseDetail';
  import { ERR_OK } from 'api/config';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import * as util from 'assets/js/util';
  import communication from 'assets/js/communication';
  import Mask from 'base/mask/mask';
  import GSelect from 'base/select2/select2';
  import Share from 'base/share/share';

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
  const VIEW = ['CourseIntro', 'CourseChapters', 'CourseEvaluate', 'CourseCommunity'];
  export default {
    inject: ['reload'],
    props: {},
    beforeRouteEnter (to, from, next) {
      next((vm) => {
//        if (/me/.test(from.name)) {
//          vm.articleId = to.params.articleId;
//          if (!to.query.first) {
//            // vm.reload();
//          }
//        }
      });
    },
    data () {
      return {
        view: 'CourseIntro',
        courseID: 0,
        pageTitle: '课程详情',
        hasSearch: false,
        hasBack: true,
        courseData: null,
        chapterData: null,
        videoUrl: null,
        coverUrl: null,
        fileUrl: null,
        appliedState: null,
        isPause: true,
        isCanplay: false,
        toptipTxt: '',
        routerPrefix: util.routerPrefix,
        courseStateStr: '加入学习',
        courseState: 0,
        applyResult: null,
        selectTitle: '套餐',
        listCourseValidityPeriod: null,
        coursePrice: '0.00',
        courseOriginalPrice: '0.00'
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
    created () {
      this.init();
    },
    methods: {
      cancelShare () {

      },
      showShare () {
        this.$refs.share.show();
      },
      share (data) {
        if (data < 0) {
          this.$router.push({
            name: 'community_commentFormRoot',
            params: {
              shareData: this.courseData,
              shareType: 1
            }
          });

        } else if (data === 1) {

        } else if (data === 2) {

        } else if (data === 3) {

        } else if (data === 4) {

        }
      },
      updateResult(data){
          this.applyResult = data;
      },
      changeTab(data){
          this.view = VIEW[data.id];
      },
      init () {
        this._getCourseID();
        this.getCourseData();
        this._listCourseValidityPeriodByCourseId().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.listCourseValidityPeriod = res.result;
            this.coursePrice = this.listCourseValidityPeriod[0].priceAfterDiscount;
            this.courseOriginalPrice = this.listCourseValidityPeriod[0].price;
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
        communication.$off();
        communication.$on('showGlobalMask', (vm) => {
          if (vm.$refs.join) {
            vm.$refs.join.style.zIndex = 1;
          }
          vm.$refs.mask.show();
        });
        communication.$on('hideGlobalMask', (vm) => {
          if (vm.$refs.join) {
            vm.$refs.join.style.zIndex = 5;
          }
          vm.$refs.mask.hide();
        });
      },
      setCourseValidityPeriod (data) {
        if (!this.courseData) {
          return;
        }
        this.courseData.courseValidityPeriod = data;
        this.coursePrice = this.courseData.courseValidityPeriod.priceAfterDiscount;
        this.courseOriginalPrice = this.courseData.courseValidityPeriod.price;
      },
      selectPeriodConfirm (data) {
        this.setCourseValidityPeriod(data.item);
        this.$refs.confirmsWrapper.show();
      },
      selectPeriodItem (data) {
        this.setCourseValidityPeriod(data.item);
      },
      ...mapMutations({
        updataBeforeLoginPage: 'UPDATA_BEFORELOGINPAGE'
      }),
      clickMask () {
        communication.$emit('clickMask', this.$refs.view);
      },
      showMask () {
        if (!this.$refs.mask) {
          return;
        }
        this.$refs.mask.show();
      },
      hideMask () {
        this.$refs.mask.hide();
      },
      getCourseData ($this) {
        $this = $this || this;
        $this._getCourseById($this);
        $this._listChaptersByCourseId($this);
      },
      _getCourseID () {
        this.courseID = this.$route.params.id;
      },
      _getCourseById ($this) {
        var param = {
          id: $this.courseID,
          userGuid: $this.userGuid
        };
        getCourseById(param).then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              $this.toptipTxt = res.message;
              $this.$refs.toptip.show();
              return;
            }
            let courseResultData = res.result;
            $this.courseData = courseResultData;
            $this.coverUrl = courseResultData.coverUrl;
            $this.appliedState = courseResultData.appliedState;
            $this.courseState = courseResultData.status;
            switch ($this.courseState) {
              case 1:
                $this.courseStateStr = COURSESTATESTR[6];
                break;
              case 3:
                $this.courseStateStr = COURSESTATESTR[4];
                break;
              default:
                if (courseResultData.applyTotalCount != 0 && (courseResultData.applyTotalCount == courseResultData.applyCount)) {
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
          productGuid: this.productGuid,
          courseValidityPeriodId: this.courseData.courseValidityPeriod.id
        };
        return applyCourse(params);
      },
      _listCourseValidityPeriodByCourseId () {
        let params = {
          courseId: this.courseID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return listCourseValidityPeriodByCourseId(params);
      },
      _listChaptersByCourseId ($this) {
        let params = {
          id: this.courseID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        listChaptersByCourseId(params).then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            if (res.result.length > 0) {
              $this.chapterData = res.result;
              if (res.result[0].type !== 2) {
                $this.fileUrl = res.result[0].fileUrl;
              } else {
                $this.videoUrl = res.result[0].videoUrl;
              }
            }
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
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
        this.$set(this.chapterData[index], key, val);
      },
      changeVideo (data) {
        var vurl = data.videoUrl, type = data.type, furl = data.fileUrl;
        if (type === 2) {
          if (vurl === this.videoUrl) {
            return;
          }
          this.isCanplay = false;
          this.videoUrl = vurl;
          this.fileUrl = null;
        } else {
          if (furl === this.fileUrl) {
            return;
          }
          this.videoUrl = null;
          this.isCanplay = false;
          this.fileUrl = furl;
        }
      },
      changeApplyResult (res) {
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
        this.$refs.selectPeriod.showFlag = true;
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
          if (this.courseData.needInfo) {
            this.applyResult = this.courseData;
            this.$router.push({
              path: `/train/${this.courseID}/applyinfocollect/${this.courseData.guid}`
            });
          } else {
            this.$refs.loading.show();
            this._applyCourse().then((res) => {
              this.$refs.loading.hide();
              this.applyResult = res.result;
              if (res.code == ERR_OK) {
                this.$router.replace({
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
      Loading,
      'g-mask': Mask,
      GSelect,
      CourseIntro,
      CourseEvaluate,
      CourseChapters,
      CourseCommunity,
      Share
    },
    watch: {
      videoUrl (newVal) {
        if (!newVal) {
          return false;
        }
        setTimeout(() => {
          this.$refs.video.addEventListener('canplay', () => {
            this.isCanplay = true;
          });
        }, 20);
      },
      $route (to, from) {
        if (to.name === 'trainDetail') {
          if (/trainDetailApply/.test(from.name)) {
            this.reload();
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train-detail";

</style>

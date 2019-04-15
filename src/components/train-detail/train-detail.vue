<template>
  <transition name="slide">
    <div class="g-train-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-search="hasSearch" :has-back="hasBack" :back-handle="'custom'"
                     :has-share="true"
                     @share="showShare" @back="back"></HeaderTitle>
      </header>
      <div class="g-video" v-if="courseData">
        <div v-if="chapterData" class="recourse-wrapper">
          <div v-if="videoUrl" class="video-wrapper">
            <video controls :src="videoUrl" ref="video" x-webkit-airplay="true" playsinline webkit-playsinline=”true” preload="auto" @canplay="videoCanplay"></video>
            <p class="video-mask" v-show="isPause" @click.stop="Vclick">
              <i class="fa"
                 :class="{'fa-spin fa-circle-o-notch': !isCanplay && !isIOS,'fa-play-circle':isCanplay || isIOS}"></i>
            </p>
          </div>
          <a class="file-link" v-else target="_blank" :href="fileUrl" :title="fileBrief">
            <img :src="coverUrl">
            <p class="mask" v-show="currentSelectSrc && currentSelectSrc.type!==4">
              <i class="fa fa-play-circle"></i>
            </p>
          </a>
        </div>
        <img v-else :src="coverUrl">
      </div>
      <nav class="g-nav-wrapper">
        <TrainDetailTab @changeTab="changeTab" :applied-state="appliedState"
                        :chapter-data="chapterData" ref="TrainDetailTab"></TrainDetailTab>
      </nav>
      <div class="g-main">
        <keep-alive>
          <component v-bind:is="view" :key="`view_${view}`" :applied-state="appliedState"
                     :course-data="courseData"
                     :chapter-data="chapterData" :apply-result="applyResult" :aggregation-opts="aggregationOpts"
                     @setdata="setDatas" @changevideo="changeVideo" @changeapplyres="changeApplyResult"
                     @selectAggregation="selectAggregation"
                     ref="view">
          </component>
        </keep-alive>
      </div>
      <div class="g-join" ref="join" v-if="courseData && (!userGuid || this.appliedState!=1)">
        <span
          class="price">{{courseData.price == 0 ? "免费" : `${courseData.price.toFixed(2)}元`}}</span>
        <button class="btn" :class="{'off': joinOff}" @click="operate">{{courseStateStr}}</button>
      </div>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading" :title="loadingTxt"></loading>
      <share @cancel="shareCancel" @share="share" @error="shareError" :share-info="shareInfo"
             @getConfigStart="shareGetConfigStart" @getConfigEnd="shareGetConfigEnd" ref="share"></share>
      <g-mask @clickMask="clickMask" ref="mask"></g-mask>
      <g-select :title="selectTitle" :select-data="listCourseValidityPeriod" @selectConfirm="selectPeriodConfirm"
                @selectListItem="selectPeriodItem"
                class="g-select-wrapper" ref="selectPeriod">
        <div class="price">
          <p class="real">￥{{coursePrice}}</p>
          <p class="original">原价：<span>¥ {{courseOriginalPrice}}</span></p>
        </div>
      </g-select>
      <keep-alive :include="keepAliveList">
        <router-view :apply-result="applyResult" @updateResult="updateResult" @courseApplyUpdate="update"
                     @evaluateUpdate="evaluateUpdate"
                     :course-data="courseData"></router-view>
      </keep-alive>
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
    getUnpaidCourseApply,
    readChapter
  } from 'api/courseDetail';
  import { getCoursePackageById, listValidityPeriodByPackageId, applyCoursePackage } from 'api/coursePackage';
  import { ERR_OK } from 'api/config';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import * as util from 'assets/js/util';
  import communication from 'assets/js/communication';
  import Mask from 'base/mask/mask';
  import GSelect from 'base/select2/select2';
  import Share from 'base/share/share';
  import NoResult from 'base/no-result/no-result';

  const LOGINTIP = '请先登录!';
  const JOINTIP = '是否加入课程开始学习?';
  const APPLYTIP = {
    LOGINTIP: '请先登录!',
    STATE_APPLY: '是否加入课程开始学习？',
    STATE_READY_APPLY: '即将开始',
    STATE_BY_COURSE_DETAIL: '课程详情',
    STATE_APPLY_GO_ON: '继续报名',
    STATE_PAY: '待支付',
    STATE_END: '课程结束',
    STATE_SELL_OUT: '课程售罄',
    STATE_PREPARTING: '准备中',
    STATE_APPLY_AGAIN: '是否加入课程开始学习？',
    STATE_AUDIT: '待审核',
    STATE_PASS_FAIL: '未通过',
    STATE_AUDIT_FAIL: '是否加入课程开始学习？'
  };
  const COURSESTATECONFIG = {
    STATE_SUCCESS: '报名完成',
    STATE_APPLY: '加入学习',
    STATE_BY_COURSE_DETAIL: '课程详情',
    STATE_APPLY_GO_ON: '继续报名',
    STATE_PAY: '待支付',
    STATE_END: '课程结束',
    STATE_SELL_OUT: '课程售罄',
    STATE_PREPARTING: '准备中',
    STATE_APPLY_AGAIN: '重新报名',
    STATE_AUDIT: '待审核',
    STATE_PASS_FAIL: '未通过',
    STATE_AUDIT_FAIL: '报名被驳回'
  };
  // applyStatus 0、加入学习  1、报名完成 6、待审核  7、未通过  8、待支付  9、被驳回  10、报名取消，显示重新报名  11、活动结束
  const COURSESTATESTR = [COURSESTATECONFIG.STATE_APPLY, COURSESTATECONFIG.STATE_SUCCESS, COURSESTATECONFIG.STATE_AUDIT, COURSESTATECONFIG.STATE_PASS_FAIL, COURSESTATECONFIG.STATE_PAY, COURSESTATECONFIG.STATE_AUDIT_FAIL, COURSESTATECONFIG.STATE_APPLY_AGAIN, COURSESTATECONFIG.STATE_END];
  const VIEW = ['CourseIntro', 'CourseChapters', 'CourseEvaluate', 'CourseCommunity'];
  export default {
    name: 'studyTrainDetail',
    data () {
      return {
        keepAliveList: /^KA_trainDetail/,
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
        fileBrief: '',
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
        courseOriginalPrice: '0.00',
        // 底部按钮激活状态
        joinOff: false,
        aggregationOpts: null,
        customConfirm: false,
        customConfirmTxt: '',
        currentSelectSrc: null,
        loadingTxt: '',
        isIOS: false,
        shareInfo: null
      };
    },
    computed: {
      confirmTxt () {
        if (!this.userGuid) {
          return APPLYTIP.LOGINTIP;
        } else if (this.customConfirm) {
          return this.customConfirmTxt;
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
      var browser = util.common.getbrowserType();
      this.isIOS = /1.2|2/.test(browser);
      this.init();
    },
    activated () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {

      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
      // this.init();
    },
    methods: {
      back () {
        this.$router.push({
          path: '/train'
        });
      },
      showShare () {
        this.$refs.share.show();
      },
      shareCancel () {
      },
      shareError (erro) {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      },
      shareGetConfigStart () {
        this.loadingTxt = '环境初始化中...';
        this.$refs.loading.show();
      },
      shareGetConfigEnd () {
        this.$refs.loading.hide();
      },
      share (data) {
        switch (data) {
          case 0:
            this.$router.push({
              name: 'community_commentFormRoot',
              params: {
                shareData: this.courseData,
                shareType: 1
              }
            });
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
        }
      },
      evaluateUpdate () {
        if (this.view === 'CourseEvaluate') {
          this._getCourseData(this).then(res => {
            this.$refs.view.updata();
          });
        }
      },
      update () {
        this.init();
      },
      updateResult (data) {
        this.applyResult = data;
      },
      changeTab (data) {
        this.view = VIEW[data.id];
      },
      init () {
        this._getCourseID();
        this.getCourseData();
        var fnName = '_listCourseValidityPeriodByCourseId';
        this[fnName]().then((res) => {
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
//  弹出询问框 已去除
//        this.$refs.confirmsWrapper.show();
        this.confirm();
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
        $this._getCourseData($this);
        if (!this.aggregation) {
          $this._listChaptersByCourseId(this.courseID).then((res) => {
            if (res.code) {
              if (res.code != ERR_OK) {
                return Promise.reject(res);
              }
              if (res.result.length > 0) {
                $this.chapterData = res.result;
                if (res.result[0].type !== 2) {
                  $this.fileUrl = res.result[0].fileUrl;
                  $this.fileBrief = res.result[0].brief;
                } else {
                  $this.videoUrl = res.result[0].videoUrl;
                }

              }
            }
          }).catch(erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      setDatas (key, val, index, dataName) {
        this.$set(this.chapterData[index], key, val);
      },
      videoCanplay () {
        this.Vplay();
      },
      changeVideo (data) {
        var vurl = data.videoUrl, type = data.type, furl = data.fileUrl;
        this.currentSelectSrc = data;
        if (this.appliedState === 1) {
          if (!this.courseData.canWatch) {
            this.customConfirm = true;
            this.customConfirmTxt = `本课程开放时间为${this.courseData.courseApplyValidityPeriod.discription}`;
            this.$refs.confirmsWrapper.show();
            return;
          }
          if (!data.read) {
            data.read = true;
            this._readChapter({chapterId: data.id, courseId: data.courseId}).then((res) => {
              if (res.code) {
                if (res.code != ERR_OK) {
                  return Promise.reject(res);
                }
              }
            }).catch(erro => {
              this.toptipTxt = erro.message;
              this.$refs.toptip.show();
            });
          }
        } else {
          if (!data.isFree) {
            this.operate();
            return;
          }
        }

        if (type === 4) {
          // 线下课程
          return;
        }
        if (type === 2) {
          if (vurl === this.videoUrl) {
            return;
          }
          this.isCanplay = false;
          this.videoUrl = vurl;
          this.fileUrl = null;
          this.fileBrief = '';
        } else {
          if (furl === this.fileUrl) {
            return;
          }
          this.videoUrl = null;
          this.isCanplay = false;
          this.fileUrl = furl;
          this.fileBrief = data.brief;
        }
      },
      changeApplyResult (res) {
        this.applyResult = res;
      },
      Vclick () {

        if (this.appliedState <= 0) {
          this.operate();
          return;
        }
        if (this.isCanplay || this.isIOS) {
          this.Vplay();
        }
      },
      Vplay () {
        this.isPause = false;
        this.$refs.video.play();
      },
      Vpause () {
        this.$refs.video.pause();
      },
      operate () {
        // applyStatus 0、加入学习  1、报名完成 6、待审核  7、未通过  8、待支付  9、被驳回  10、报名取消，显示重新报名  11、活动结束
        var query = {}, applyIdKey = 'courseApplyValidityPeriod', applyId;
        query.applyTargetId = this.courseData.id;
        if (this.aggregation) {
          query.type = 'aggregation';
        }
        switch (this.appliedState) {
          case 0:
          case 10:
            this.$refs.selectPeriod.showFlag = true;
            break;
          case 6:
          case 7:
          case 8:
            applyId = this.courseData.courseApplyValidityPeriod.courseApplyId;
            query.applyId = applyId;
            this.$router.push({
              path: `/train/all/applyresult`,
              append: true,
              query: query
            });
            break;
          case 9:
            var isReapply = this.$route.query.isReapply == 1;
            applyId = this.courseData.courseApplyValidityPeriod.courseApplyId;
            query.applyId = applyId;
            if (isReapply) {
              this.$refs.selectPeriod.showFlag = true;
            } else {
              this.$router.push({
                path: `/train/all/applyresult`,
                append: true,
                query: query
              });
            }

            break;
        }

      },
      confirm () {
        if (this.customConfirm) {
          this.customConfirm = false;
        }
        if (!this.userGuid) {
          this.updataBeforeLoginPage(this.$route.fullPath);
          this.$router.push({
            path: this.routerPrefix + '/user/login'
          });
          return false;
        }
        if (this.courseStateStr === COURSESTATECONFIG.STATE_APPLY || this.courseStateStr === COURSESTATECONFIG.STATE_APPLY_GO_ON || this.courseStateStr === COURSESTATECONFIG.STATE_APPLY_AGAIN || this.courseStateStr === COURSESTATECONFIG.STATE_AUDIT_FAIL) {
          var query = {};
          if (this.aggregation) {
            query.type = 'aggregation';
          }
          if (this.courseData.needInfo) {
            this.applyResult = this.courseData;
            this.$router.push({
              path: `/train/all/${this.courseID}/applyinfocollect/${this.courseData.guid}`,
              query: query
            });
          } else {
            this.$refs.loading.show();
            this._applyCourse().then((res) => {
              this.$refs.loading.hide();
              this.applyResult = res.result;
              var applyKey = 'courseApply';
              query.applyId = this.applyResult[applyKey].id;
              query.applyTargetId = this.courseID;
              if (res.code == ERR_OK) {
                this.$router.push({
                  path: `/train/all/applyresult`,
                  append: true,
                  query: query
                });
              } else if (res.code == '201') {
                this.$router.push({
                  path: `/pay/courseApplypay`,
                  query: query
                });
              } else {
                util.common.request.tipMsg(this, res);
              }
            }, erro => {
              this.$refs.loading.hide();
              util.common.request.tipMsg(this, erro);
            });
          }
        }
      },
      cancel () {
        if (this.customConfirm) {
          this.customConfirm = false;
        }
      },
      selectAggregation (data) {
        this._listChaptersByCourseId(data.id).then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.chapterData = null;
            if (res.result.length > 0) {
              this.chapterData = res.result;
            }
          }
        }).catch(erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      _getCourseID () {
        this.aggregation = this.$route.query.type === 'aggregation';
        this.courseID = this.$route.params.id;
      },
      _getCourseData ($this) {
        return this._getCourseById($this).then((res) => {
          if (res.code || $this.aggregation) {
            if (res.code != ERR_OK && !$this.aggregation) {
              $this.toptipTxt = res.message;
              $this.$refs.toptip.show();
              return;
            }
            let courseResultData = res.result;
            if ($this.aggregation) {
              courseResultData = res.result;
              var aggregationOpts = courseResultData.itemList;
              if (aggregationOpts && aggregationOpts.length > 0) {
                $this.aggregationOpts = aggregationOpts;
                $this._listChaptersByCourseId($this.aggregationOpts[0].id).then((res) => {
                  if (res.code) {
                    if (res.code != ERR_OK) {
                      return Promise.reject(res);
                    }
                    $this.chapterData = null;
                    if (res.result.length > 0) {
                      $this.chapterData = res.result;
                      if (res.result[0].type !== 2) {
                        $this.fileUrl = res.result[0].fileUrl;
                        $this.fileBrief = res.result[0].brief;
                      } else {
                        $this.videoUrl = res.result[0].videoUrl;
                      }
                    }
                  }
                }).catch(erro => {
                  this.toptipTxt = erro.message;
                  this.$refs.toptip.show();
                });
              }
            }
            $this.courseData = courseResultData;
            $this.coverUrl = courseResultData.coverUrl;
            $this.shareInfo = this.shareInfo = {
              url: window.location.href,
              cover: this.courseData.coverUrl,
              desc: this.courseData.title,
              title: this.courseData.title,
              summary: this.courseData.title
            };
            // applyStatus 0、加入学习  1、报名完成 6、待审核  7、未通过  8、待支付  9、被驳回  10、报名取消，显示重新报名  11、活动结束
            $this.appliedState = courseResultData.appliedState;
            $this.courseState = courseResultData.status;
            $this.courseStateStr = COURSESTATESTR[$this.appliedState];
            if (courseResultData.appliedState === 1 && courseResultData.chapterCount > 0) {
              this.$refs.TrainDetailTab.changeTab(this.$refs.TrainDetailTab.list[1]);
            }
            if ($this.appliedState > 1) {
              $this.courseStateStr = COURSESTATESTR[$this.appliedState - 4];
            }
            if ($this.appliedState == 9) {
              var isReapply = this.$route.query.isReapply == 1;
              if (isReapply) {
                $this.courseStateStr = COURSESTATECONFIG.STATE_APPLY_AGAIN;
              }
            }
            switch ($this.appliedState) {
              case 1:
              case 11:
                $this.joinOff = true;
                break;
              default:
                $this.joinOff = false;
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
      _applyCoursePackage () {
        let params = {
          id: this.courseID,
          userGuid: this.userGuid,
          productGuid: this.productGuid,
          validityPeriodId: this.courseData.courseValidityPeriod.id
        };
        return applyCoursePackage(params);
      },
      _listCourseValidityPeriodByCourseId () {
        let params = {
          courseId: this.courseID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return listCourseValidityPeriodByCourseId(params);
      },
      _listValidityPeriodByPackageId () {
        let params = {
          id: this.courseID
        };
        return listValidityPeriodByPackageId(params);
      },
      _getCoursePackageById ($this) {
        let params = {
          id: $this.courseID,
          userGuid: $this.userGuid
        };
        return getCoursePackageById(params);
      },
      _getCourseById ($this) {
        let params = {
          id: $this.courseID,
          userGuid: $this.userGuid
        };
        if ($this.aggregation) {
          params.stype = 2;
        }
        return getCourseById(params);
      },
      _readChapter (data) {
        let params = {
          chapterId: data.chapterId,
          courseId: data.courseId,
          userGuid: this.userGuid
        };
        if (this.aggregation) {
          params.stype = 2;
        }
        return readChapter(params);
      },
      _listChaptersByCourseId (id) {
        let params = {
          id: id,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return listChaptersByCourseId(params);
      },
      _getUnpaidCourseApply () {
        let params = {
          courseId: this.courseID,
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        return getUnpaidCourseApply(params);
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
      Share,
      NoResult
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
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train-detail";

</style>

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
                        <video controls :src="videoUrl" ref="video" @canplay="videoCanplay"></video>
                        <p class="video-mask" v-show="isPause" @click.stop="Vclick">
                            <i class="fa"
                               :class="{'fa-spin fa-circle-o-notch': !isCanplay,'fa-play-circle':isCanplay}"></i>
                        </p>
                    </div>
                    <a class="file-link" v-else target="_blank" :href="fileUrl">
                        <img :src="coverUrl">
                    </a>
                </div>
                <img v-else :src="coverUrl">
            </div>
            <nav class="g-nav-wrapper">
                <TrainDetailTab @changeTab="changeTab" :applied-state="appliedState"></TrainDetailTab>
            </nav>
            <div class="g-main">
                <keep-alive>
                    <component v-bind:is="view" :key="`view_${view}`" :applied-state="appliedState"
                               :course-data="courseData"
                               :chapter-data="chapterData" :apply-result="applyResult"
                               @setdata="setDatas" @changevideo="changeVideo" @changeapplyres="changeApplyResult"
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
        getUnpaidCourseApply
    } from 'api/courseDetail';
    import {ERR_OK} from 'api/config';
    import {mapGetters, mapMutations} from 'vuex';
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
        data() {
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
                joinOff: false
            };
        },
        computed: {
            confirmTxt() {
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
        created() {
            this.init();
        },
        activated() {
          if (!this.$route.meta.isBack || this.isFirstEnter) {

          }
          this.$route.meta.isBack = false;
          this.isFirstEnter = false;
            // this.init();
        },
        methods: {
            back() {
                this.$router.push({
                    path: '/train'
                });
            },
            cancelShare() {

            },
            showShare() {
                this.$refs.share.show();
            },
            share(data) {
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
            evaluateUpdate() {
                if (this.view === 'CourseEvaluate') {
                    this._getCourseById(this).then(res => {
                        this.$refs.view.updata();
                    });
                }
            },
            update(){
              this.init();
            },
            updateResult(data) {
                this.applyResult = data;
            },
            changeTab(data) {
                this.view = VIEW[data.id];
            },
            init() {
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
            setCourseValidityPeriod(data) {
                if (!this.courseData) {
                    return;
                }
                this.courseData.courseValidityPeriod = data;
                this.coursePrice = this.courseData.courseValidityPeriod.priceAfterDiscount;
                this.courseOriginalPrice = this.courseData.courseValidityPeriod.price;
            },
            selectPeriodConfirm(data) {
                this.setCourseValidityPeriod(data.item);
                this.$refs.confirmsWrapper.show();
            },
            selectPeriodItem(data) {
                this.setCourseValidityPeriod(data.item);
            },
            ...mapMutations({
                updataBeforeLoginPage: 'UPDATA_BEFORELOGINPAGE'
            }),
            clickMask() {
                communication.$emit('clickMask', this.$refs.view);
            },
            showMask() {
                if (!this.$refs.mask) {
                    return;
                }
                this.$refs.mask.show();
            },
            hideMask() {
                this.$refs.mask.hide();
            },
            getCourseData($this) {
                $this = $this || this;
                $this._getCourseById($this);
                $this._listChaptersByCourseId($this);
            },
            setDatas(key, val, index, dataName) {
                this.$set(this.chapterData[index], key, val);
            },
            videoCanplay() {
                this.Vplay();
            },
            changeVideo(data) {
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
            changeApplyResult(res) {
                this.applyResult = res;
            },
            Vclick() {
                if (this.appliedState <= 0) {
                    this.operate();
                    return;
                }
                if (this.isCanplay) {

                    this.Vplay();
                }
            },
            Vplay() {
                this.isPause = false;
                this.$refs.video.play();
            },
            Vpause() {
                this.$refs.video.pause();
            },
            operate() {
                // applyStatus 0、加入学习  1、报名完成 6、待审核  7、未通过  8、待支付  9、被驳回  10、报名取消，显示重新报名  11、活动结束
                switch (this.appliedState) {
                    case 0:
                    case 10:
                        this.$refs.selectPeriod.showFlag = true;
                        break;
                    case 6:
                    case 7:
                    case 8:
                        this.$router.push({
                            path: `applyresult`,
                            append: true,
                            query: {
                                applyId: this.courseData.courseApplyValidityPeriod.courseApplyId
                            }
                        });
                        break;
                    case 9:
                        var isReapply = this.$route.query.isReapply == 1;
                        if (isReapply) {
                            this.$refs.selectPeriod.showFlag = true;
                        } else {
                            this.$router.push({
                                path: `applyresult`,
                                append: true,
                                query: {
                                    applyId: this.courseData.courseApplyValidityPeriod.courseApplyId
                                }
                            });
                        }

                        break;
                }

            },
            confirm() {
                if (!this.userGuid) {
                    this.updataBeforeLoginPage(this.$route.fullPath);
                    this.$router.push({
                        path: this.routerPrefix + '/user/login'
                    });
                    return false;
                }
                if (this.courseStateStr === COURSESTATECONFIG.STATE_APPLY || this.courseStateStr === COURSESTATECONFIG.STATE_APPLY_GO_ON || this.courseStateStr === COURSESTATECONFIG.STATE_APPLY_AGAIN || this.courseStateStr === COURSESTATECONFIG.STATE_AUDIT_FAIL) {
                    if (this.courseData.needInfo) {
                        this.applyResult = this.courseData;
                        this.$router.push({
                            path: `/train/all/${this.courseID}/applyinfocollect/${this.courseData.guid}`
                        });
                    } else {
                        this.$refs.loading.show();
                        this._applyCourse().then((res) => {
                            this.$refs.loading.hide();
                            this.applyResult = res.result;
                            if (res.code == ERR_OK) {
                                this.$router.push({
                                    path: `applyresult`,
                                    append: true,
                                    query: {
                                        applyId: this.applyResult.courseApply.id
                                    }
                                });
                            } else if (res.code == '201') {
                                this.$router.push({
                                    path: `/pay/courseApplypay`,
                                    query: {
                                        applyTargetId: this.courseData.id,
                                        applyId: this.applyResult.courseApply.id
                                    }
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
            cancel() {
                if (this.confirmTxt === JOINTIP) {
                    console.log(JOINTIP);
                } else {
                    console.log(LOGINTIP);
                }
            },
            _getCourseID() {
                this.courseID = this.$route.params.id;
            },
            _getCourseById($this) {
                var param = {
                    id: $this.courseID,
                    userGuid: $this.userGuid
                };
                return getCourseById(param).then((res) => {
                    if (res.code) {
                        if (res.code != ERR_OK) {
                            $this.toptipTxt = res.message;
                            $this.$refs.toptip.show();
                            return;
                        }
                        let courseResultData = res.result;
                        $this.courseData = courseResultData;
                        $this.coverUrl = courseResultData.coverUrl;
                        // applyStatus 0、加入学习  1、报名完成 6、待审核  7、未通过  8、待支付  9、被驳回  10、报名取消，显示重新报名  11、活动结束
                        $this.appliedState = courseResultData.appliedState;
                        $this.courseState = courseResultData.status;
                        $this.courseStateStr = COURSESTATESTR[$this.appliedState];
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
            _applyCourse() {
                let params = {
                    id: this.courseID,
                    userGuid: this.userGuid,
                    productGuid: this.productGuid,
                    courseValidityPeriodId: this.courseData.courseValidityPeriod.id
                };
                return applyCourse(params);
            },
            _listCourseValidityPeriodByCourseId() {
                let params = {
                    courseId: this.courseID,
                    userGuid: this.userGuid,
                    productGuid: this.productGuid
                };
                return listCourseValidityPeriodByCourseId(params);
            },
            _listChaptersByCourseId($this) {
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
            _getUnpaidCourseApply() {
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
            Share
        },
        watch: {
            videoUrl(newVal) {
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

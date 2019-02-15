<template>
    <transition name="slide">
        <div class="g-evaluateForm">
            <header class="g-header">
                <HeaderTitle :title="pageTitle" :has-back="true" :has-operate="true" :operate-str="'完成'"
                             @operate="send"></HeaderTitle>
            </header>
            <div class="operate">
                <div class="title">
                    <span>我的评分</span>
                </div>
                <div class="score">
                    <star :score="score" :size="starSize" @clickStar="clickStar"></star>
                </div>
            </div>
            <div class="g-main">
                <scroll ref="scroll">
                    <div>
          <textarea class="form-cont" name="feedback" rows="100" v-model="formCont"
                    placeholder="写几句评价"></textarea>
                    </div>
                </scroll>
            </div>
            <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
            <top-tip ref="toptip" :delay="10000">
                <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
            </top-tip>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll';
    import HeaderTitle from 'components/header-title/header-title';
    import {ERR_OK} from 'api/config';
    import * as util from 'assets/js/util';
    import {addEvaluate} from 'api/courseDetail';
    import {mapGetters, mapMutations} from 'vuex';
    import TopTip from 'base/top-tip/top-tip';
    import Confirm from 'base/confirm/confirm';
    import Star from 'base/star/star';

    export default {
        name: 'KA_trainDetailCourseEvaluateForm',
        props: ['courseData'],
        data() {
            return {
                confirmTxt: '请先登录!',
                toptipTxt: '',
                pageTitle: '写评论',
                formCont: '',
                score: 0,
                starSize: 36,
                sendFlag: true
            };
        },
        computed: {
            ...mapGetters([
                'productGuid',
                'userGuid',
                'userInfo'
            ])
        },
        created() {
            if (this.courseData.myEvaluate) {
                this.score = this.courseData.myEvaluate.star / 2;
                this.formCont = this.courseData.myEvaluate.content;
            }
        },
        mounted() {
        },
        methods: {
            clickStar(e, index) {
                var x = e.offsetX, score = index + 1;
                var isHalf = parseInt(this.starSize / 2);
                if (x < isHalf) {
                    score -= 0.5;
                }
                this.score = score;
            },
            confirm() {
                this.$router.push({
                    path: '/user/login'
                });
            },
            cancel() {

            },
            send() {
                if (!this.sendFlag || !this.userGuid || !this.userInfo) {
                    if (!this.userGuid) {
                        this.$refs.confirmsWrapper.show();
                    }
                    return false;
                }
                this.sendFlag = false;
                this._addEvaluate().then((res) => {
                    if (res.code) {
                        if (res.code != ERR_OK) {
                            return Promise.reject(res);
                        }
                        this.$emit('evaluateUpdate');
                        this.$router.back();
                    }
                }).catch(error => {
                    this.toptipTxt = error.message;
                    this.$refs.toptip.show();
                }).finally(() => {
                    this.sendFlag = true;
                });
            },
            _addEvaluate() {
                var param = {
                    userGuid: this.userGuid,
                    targetGuid: this.courseData.guid,
                    targetId: this.courseData.id,
                    type: 1,
                    clientType: 1,
                    version: 1,
                    star: this.score * 2,
                    content: this.formCont
                };
                return addEvaluate(param);
            }
        },
        watch: {},
        components: {
            HeaderTitle,
            TopTip,
            Scroll,
            Confirm,
            Star
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "~assets/scss/compile";
    @import "./evaluateForm";

</style>

<template>
    <transition name="slide">
        <div class="g-tag-list">
            <header class="g-header">
                <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
            </header>
            <div class="g-main">
                <scroll ref="scroll" class="tag-detail-content" :data="tagList">
                    <div>
                        <div class="g-tag">
                            <ul class="course-list" v-if="tagList && tagList.length>0">
                                <li class="course-item" v-for="(item, index) in tagList" :key="index">
                                    <p class="title">{{item.title}}</p>
                                    <ul class="tag-list">
                                        <li class="tag-item" v-for="(titem, tindex) in item.tagList" :key="tindex">
                                            <router-link :to="{path: `/train/all/tagdetail/${titem.id}`}">
                                                {{titem.name}}
                                            </router-link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr :
                                loadingMore}}</p>
                        </div>
                        <div class="feedback">
                            <p class="txt">找不到您喜欢的课程？</p>
                            <router-link class="btn" :to="{path: `/feedback`}">
                                告诉我们
                            </router-link>
                        </div>
                    </div>
                </scroll>
            </div>
            <top-tip ref="toptip" :delay="10000">
                <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
            </top-tip>
            <keep-alive :include="keepAliveList">
                <router-view></router-view>
            </keep-alive>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import 'swiper/dist/css/swiper.css';
    import Scroll from 'base/scroll/scroll';
    import HeaderTitle from 'components/header-title/header-title';
    import {ERR_OK} from 'api/config';
    import * as util from 'assets/js/util';
    import {listTagContainers} from 'api/train';
    import {mapGetters, mapMutations} from 'vuex';
    import TopTip from 'base/top-tip/top-tip';
    import CourseItem from 'base/course-item/course-item';

    export default {
        name: 'studyTagList',
        beforeRouteEnter(to, from, next) {
            if (from.name === 'tagDetail') { // 这个name是下一级页面的路由name
                to.meta.isBack = true; // 设置为true说明你是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
            }
            next();
        },
        data() {
            return {
                keepAliveList: [],
                toptipTxt: '',
                pageTitle: '课程分类',
                tagList: null,
                requestMoreFlag: false,
                noMore: false,
                loadingMore: '加载中。。。',
                noMoreStr: '没有更多了~',
                coursePage: 1,
                noResult: '暂无课程~~'
            };
        },
        computed: {
            ...mapGetters([
                'productGuid',
                'userGuid'
            ])
        },
        created() {

        },
        activated() {
            if (!this.$route.meta.isBack || this.isFirstEnter) {
                this._listTagContainers().then((res) => {
                    if (res.code) {
                        if (res.code != ERR_OK) {
                            this.toptipTxt = res.message;
                            this.$refs.toptip.show();
                            return;
                        }
                        this.tagList = res.result;
                    }
                }, erro => {
                    this.toptipTxt = erro.message;
                    this.$refs.toptip.show();
                });
            }
            this.$route.meta.isBack = false;
            this.isFirstEnter = false;
        },
        mounted() {
        },
        methods: {
            _listTagContainers(page) {
                var param = {
                    productGuid: this.productGuid
                };
                return listTagContainers(param);
            }
        },
        watch: {
            courseIntro() {
                this.$nextTick(() => {
                    this.$refs.scroll.refresh();
                });
            },
            courseList() {
                this.$nextTick(() => {
                    this.$refs.scroll.refresh();
                });
            }
        },
        components: {
            HeaderTitle,
            TopTip,
            Scroll,
            CourseItem
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "~assets/scss/compile";
    @import "./taglist";

</style>

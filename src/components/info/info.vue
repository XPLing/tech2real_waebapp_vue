<template>
    <div class="g-info">
        <header class="g-header">
            <HeaderTitle :title="pageTitle"></HeaderTitle>
        </header>
        <div class="g-banner" v-if="bannerList">
            <swiper :options="swiperOPts" class="g-swiper">
                <swiper-slide v-for="(item, index) in bannerList" :key="index">
                    <img :src="item.coverUrl" @click="bannerClick(item)">
                </swiper-slide>
                <div class="swiper-pagination swiper-pagination-banner" slot="pagination"></div>
            </swiper>
        </div>
        <div class="g-tag" :class="{'active':tagFloatFlag}" ref="tag" v-if="tagList">
            <swiper :options="swiperOPts_tag" class="g-swiper">
                <swiper-slide v-for="(item, index) in tagList" :key="index">
                    <div class="tag-item" :class="{'active': tagCurrentIndex === index}"
                         @click="changeTag(item, index)">
                        {{item.name}}
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="bg-layer" ref="bgLayer"></div>
        <div class="g-main" ref="main">
            <scroll ref="scroll" class="train-content" :pullup="true" :data="bannerList" :probeType="probeType"
                    @pullingUp="requestInfo" :listenScroll="true" @scroll="scrollHandle">
                <div>
                    <div class="g-info-list" v-if="infoList.length>0">
                        <div class="info-type-item" v-for="(item,index) in infoList" :key="index"
                             v-show="tagCurrentIndex===index">
                            <ul class="list">
                                <info-item :show-special="true" :type="tagCurrentIndex+1" :info="Iitem"
                                           v-for="(Iitem, Iindex) in item"
                                           :key="Iindex"
                                           @selectInfo="selectInfo"></info-item>
                            </ul>
                            <div v-if="item.length<=0" class="no-result-wrapper">
                                <no-result :title="'暂无资讯~~'"></no-result>
                            </div>
                            <div v-else>
                                <p v-show="requestMoreFlag[index] || noMore[index]" class="request-result">
                                    {{noMore[index] ? noMoreStr : noResult}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll>
        </div>
        <top-tip ref="toptip" :delay="10000">
            <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
        </top-tip>
        <back-top ref="backTop" @backTop="backTop"></back-top>
        <keep-alive :include="keepAliveList">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script type="text/ecmascript-6">
    import 'swiper/dist/css/swiper.css';
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import Scroll from 'base/scroll/scroll';
    import HeaderTitle from 'components/header-title/header-title';
    import {ERR_OK} from 'api/config';
    import * as util from 'assets/js/util';
    import {mapGetters, mapMutations} from 'vuex';
    import TopTip from 'base/top-tip/top-tip';
    import Loading from 'base/loading/loading';
    import InfoItem from 'base/info-item/info-item';
    import NoResult from 'base/no-result/no-result';
    import {listNewsCategories, listNewsArticlesByCategory, listArticlesByClubGuids} from 'api/info';
    import listBannersByLocationType from 'api/banner';
    import BackTop from 'base/backtop/backtop';

    const NAV_HEIGHT = util.common.calculateWH(40);
    const TAG_HEIGHT = util.common.calculateWH(44);
    const BANNER_HEIGHT = util.common.calculateWH(200);
    const transform = util.common.cssPrefix('transform');

    export default {
        provide() {
            return {
                reload: this.reload
            };
        },
        data() {
            return {
                keepAliveList: /^KA_infoDetail/,
                probeType: 3,
                toptipTxt: '',
                pageTitle: '资讯',
                currView: 'v-a',
                isRouterAlive: true,
                swiperOPts: {
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false
                    },
                    pagination: {
                        el: '.swiper-pagination-banner',
                        clickable: true
                    }
                },
                swiperOPts_tag: {
                    freeMode: true,
                    slidesPerView: 4,
                    pagination: false
                },
                tagList: null,
                requestDataName: ['_listNewsArticlesByCategory', '_listArticlesByClubGuids'],
                tagCurrentIndex: 0,
                bannerList: null,
                requestMoreFlag: [false, false],
                noMore: [false, false],
                noResult: '加载中。。。',
                noMoreStr: '没有更多了~',
                infoPage: [1, 1],
                infoList: [],
                scrollY: 0,
                tagFloatFlag: false
            };
        },
        created() {
            this.minY = -BANNER_HEIGHT;
            this.oldTop = 0;
        },
        activated() {
            this._listBannersByLocationType().then((res) => {
                if (res.code) {
                    if (res.code != ERR_OK) {
                        return Promise.reject(res);
                    }
                    this.bannerList = res.result;
                }
            }).catch(erro => {
                this.toptipTxt = erro.message;
                this.$refs.toptip.show();
            });
            this._listNewsCategories().then((res) => {
                if (res.code) {
                    if (res.code != ERR_OK) {
                        return Promise.reject(res);
                    }
                    this.tagList = res.result;
                    for (var i = 0, len = res.result.length; i < len; i++) {
                        this.$set(this.infoList, i, []);
                    }
                    this.requestInfo();
                }
            }).catch(erro => {
                this.toptipTxt = erro.message;
                this.$refs.toptip.show();
            });
        },
        computed: {
            ...mapGetters([
                'productGuid',
                'userGuid'
            ])
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                });
            },
            selectInfo(info) {
                var url = `/info/infodetail/${info.id}`;
                this.$router.push({
                    path: url
                });
            },
            backTop() {
                this.$refs.scroll.scrollTo(0, 0, 300);
            },
            scrollHandle(pos) {
                this.scrollY = pos.y;
            },
            changeTag(item, index) {
                this.tagCurrentIndex = index;
                this.requestInfo();
                this.$nextTick(() => {
                    this.$refs.scroll.refresh();
                    this.$refs.scroll.scrollTo(0, 0);
                    var bgLayerDom = this.$refs.bgLayer;
                    var tagDom = this.$refs.tag;
                    if (this.oldTop != 0) {
                        bgLayerDom.style[transform] = `translate3d(0,0,0)`;
                        tagDom.style[transform] = `translate3d(0,0,0)`;
                    }

                });
            },
            requestInfo() {
                if (this.noMore[this.tagCurrentIndex]) {
                    return;
                }
                if (!this.requestMoreFlag[[this.tagCurrentIndex]]) {
                    this.$set(this.requestMoreFlag, this.tagCurrentIndex, true);
                    this[this.requestDataName[this.tagCurrentIndex]](this.tagList[this.tagCurrentIndex].id, this.infoPage[this.tagCurrentIndex]).then((res) => {
                        this.$refs.scroll.finishPullUp();
                        this.$set(this.requestMoreFlag, this.tagCurrentIndex, false);
                        if (res.code) {
                            if (res.code != ERR_OK) {
                                this.toptipTxt = res.message;
                                this.$refs.toptip.show();
                                return;
                            }
                            if (res.result.length > 0) {
                                if (this.infoList[this.tagCurrentIndex]) {
                                    this.$set(this.infoList, this.tagCurrentIndex, this.infoList[this.tagCurrentIndex].concat(res.result));
                                } else {
                                    this.$set(this.infoList, this.tagCurrentIndex, res.result);
                                }
                                this.infoPage[this.tagCurrentIndex] = this.infoPage[this.tagCurrentIndex] + 1;
                            } else {
                                this.$set(this.noMore, this.tagCurrentIndex, true);
                                this.$refs.scroll.closePullUp();
                                this.$nextTick(() => {
                                    this.$refs.scroll.refresh();
                                });
                            }
                        }
                    }, erro => {
                        this.$refs.scroll.finishPullUp();
                        this.toptipTxt = erro.message;
                        this.$refs.toptip.show();
                    });
                }
            },
            switching(val) {
                this.currView = val;
            },
            bannerClick(data) {
                /**
                 * banner type: 1.资讯 2.活动 3.课程 4.网页 5. 老师
                 */
                var params = JSON.parse(data.params);
                switch (data.type) {
                    case 1:
                        this.$router.push({
                            path: `/info/infodetail/${params.id}`
                        });
                        break;
                    case 2:
                        this.$router.push({
                            path: `/activity/list/detail/${params.id}`
                        });
                        break;
                    case 3:
                        this.$router.push({
                            path: `/train/all/${params.id}`
                        });
                        break;
                    case 4:
                        window.open(params.url);
                        break;
                    case 5:
                        this.$router.push({
                            path: `/train/all/teacherdetail/${params.id}`
                        });
                        break;
                }
            },
            _listBannersByLocationType() {
                var param = {
                    productGuid: this.productGuid,
                    type: 2,
                    userGuid: this.userGuid
                };
                return listBannersByLocationType(param);
            },
            _listNewsCategories() {
                var param = {
                    productGuid: this.productGuid,
                    parentId: 132
                };
                return listNewsCategories(param);
            },
            _listNewsArticlesByCategory(id, page) {
                var param = {
                    productGuid: this.productGuid,
                    categoryId: id,
                    page: page,
                    limitSize: 10
                };
                return listNewsArticlesByCategory(param);
            },
            _listArticlesByClubGuids(id, page) {
                var param = {
                    userGuid: this.userGuid,
                    page: page,
                    limitSize: 10
                };
                return listArticlesByClubGuids(param);
            }
        },
        watch: {
            scrollY(newVal) {
                var bgLayerDom = this.$refs.bgLayer;
                var tagDom = this.$refs.tag;
                var newmainTop = newVal;
                if (newVal < 0) {
                    if (newVal <= this.minY) {
                        newmainTop = this.minY;
                    }
                } else {
                    newmainTop = 0;
                }
                if (newVal < -100) {
                    if (!this.$refs.backTop.backTopShowFlag) {
                        this.$refs.backTop.showIcon();
                    }
                } else {
                    if (this.$refs.backTop.backTopShowFlag) {
                        this.$refs.backTop.hideIcon();
                    }
                }
                if (this.oldTop !== newmainTop) {
                    bgLayerDom.style[transform] = `translate3d(0,${newmainTop}px,0)`;
                    tagDom.style[transform] = `translate3d(0,${newmainTop}px,0)`;
                }
                this.oldTop = newmainTop;
            },
            infoList() {
                this.$nextTick(() => {
                    this.$refs.scroll.refresh();
                });
            }
        },
        components: {
            HeaderTitle,
            swiper,
            swiperSlide,
            TopTip,
            Loading,
            Scroll,
            InfoItem,
            BackTop,
            NoResult
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "~assets/scss/compile";
    @import "./info";

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all .3s ease;
    }
</style>

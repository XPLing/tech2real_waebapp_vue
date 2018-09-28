<template>
  <transition name="slide">
    <div class="g-club-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-tag" :class="{'active':tagFloatFlag}" ref="tag" v-if="tagList">
        <div class="tag-item" v-for="(item, index) in tagList" :key="index"
             :class="{'active': tagCurrentIndex === index}"
             @click="changeTag(item, index)">
          {{item.name}}
        </div>
      </div>
      <div class="g-main" ref="main">
        <scroll ref="scroll" class="train-content" :pullup="true" :data="infoList" :probeType="probeType"
                @pullingUp="requestScrollData" :listenScroll="true" @scroll="scrollHandle">
          <div>
            <div class="g-info-list" v-if="infoList">
              <div class="info-type-item" v-for="(item,index) in infoList" :key="index"
                   v-show="tagCurrentIndex===index">
                <div v-if="item && item.length>0">
                  <template v-if="index===0">
                    <my-msg-reply v-for="(ritem,rindex) in item" :key="rindex" :data="ritem"
                                  @selectItem="selectReply"></my-msg-reply>
                  </template>
                  <template v-else-if="index===1">
                    <my-msg-like v-for="(litem,lindex) in item" :key="lindex" :data="litem"
                                 @selectItem="selectReply"></my-msg-like>
                  </template>
                  <template v-else>
                    <my-msg-notice v-for="(nitem,nindex) in item" :key="nindex" :data="nitem"
                                   @selectItem="selectNotice"></my-msg-notice>
                  </template>
                </div>
                <template v-else>
                  <div v-if="!item" class="no-result-wrapper">
                    <no-result :title="'暂无内容~~'"></no-result>
                  </div>
                  <div v-else>
                    <p v-show="requestMoreFlag[index] || noMore[index]" class="request-result">
                      {{noMore[index] ? noMoreStr : noResult}}</p>
                  </div>
                </template>

              </div>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <back-top ref="backTop" @backTop="backTop"></back-top>
      <keep-alive >
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import { listNotifiesByType } from 'api/me';
  import BackTop from 'base/backtop/backtop';
  import MyMsgReply from 'base/myMsg-reply/myMsg-reply';
  import MyMsgLike from 'base/myMsg-like/myMsg-like';
  import MyMsgNotice from 'base/myMsg-notice/myMsg-notice';

  export default {
    data () {
      return {
        probeType: 2,
        toptipTxt: '',
        pageTitle: '我的消息',
        tagList: [
          {
            name: '回复',
            type: 2
          },
          {
            name: '赞',
            type: 1
          },
          {
            name: '通知',
            type: 3
          }
        ],
        tagCurrentIndex: 0,
        requestMoreFlag: [false, false, false],
        requestFun: ['_listNotifiesByType', '_listNotifiesByType', '_listNotifiesByType'],
        noMore: [false, false, false],
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        infoPage: [1, 1, 1],
        infoList: [],
        tagFloatFlag: false
      };
    },
    created () {
    },
    activated(){
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.requestScrollData();
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      selectNotice (data) {
        console.log(data);
        if (!data.isRead) {
          data.isRead = false;
        }
        var params = JSON.parse(data.params);
        var url = `/activity/list/detail/${params.activityId}/applyresult`;
        this.$router.push({
          path: url
        });
      },
      selectReply (data, detail) {

        /* commentType 2.资讯 3.活动 4.社群 */
        var url, title;
        switch (detail.commentType) {
          case 2:
            url = `/info/infodetail/commentlist/${detail.commentId}`;
            title = `${detail.commentNickname}的评论`;
            break;
          case 3:
            url = `/activity/commentlist/${detail.commentId}`;
            title = `${detail.commentNickname}的评论`;
            break;
          case 4:
            url = `/community/${detail.commentId}`;
            break;
        }
        var opt = {};
        opt.path = url;
        if (title) {
          opt.query = {
            title: title
          };
        }
        this.$router.push(opt);
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      scrollHandle (pos) {
        this.scrollY = pos.y;
      },
      changeTag (item, index) {
        this.tagCurrentIndex = index;
        if (!this.infoList[this.tagCurrentIndex] && !this.requestMoreFlag[[this.tagCurrentIndex]]) {
          this.requestScrollData();
        }
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      requestScrollData () {
        if (this.noMore[this.tagCurrentIndex]) {
          return;
        }
        if (!this.requestMoreFlag[[this.tagCurrentIndex]]) {
          this.requestMoreFlag[this.tagCurrentIndex] = true;
          this[this.requestFun[this.tagCurrentIndex]](this.infoPage[this.tagCurrentIndex], this.tagList[this.tagCurrentIndex].type).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.$set(this.requestMoreFlag, this.tagCurrentIndex, false);
            if (res.code) {
              if (res.code != ERR_OK) {
                return Promise.reject(res);
              }
              if (res.result.length > 0) {
                if (this.infoList[this.tagCurrentIndex]) {
                  this.$set(this.infoList, this.tagCurrentIndex, this.infoList[this.tagCurrentIndex].concat(res.result));
                } else {
                  this.$set(this.infoList, this.tagCurrentIndex, res.result);
                }
                this.infoPage[this.tagCurrentIndex] = this.infoPage[this.tagCurrentIndex] + 1;
              } else {
                if (!this.infoList[this.tagCurrentIndex]) {
                  this.$set(this.infoList, this.tagCurrentIndex, []);
                }
                this.$set(this.noMore, this.tagCurrentIndex, true);
                this.$refs.scroll.closePullUp();
                this.$nextTick(() => {
                  this.$refs.scroll.refresh();
                });
              }
            }
          }).catch(error => {
            this.$refs.scroll.finishPullUp();
            this.toptipTxt = error.message;
            this.$refs.toptip.show();
          });
        }
      },
      switching (val) {
        this.currView = val;
      },
      _listNotifiesByType (page, type) {
        var param = {
          limitSize: 10,
          page: page,
          version: 1,
          clientType: 1,
          type: type,
          userGuid: this.userGuid
        };
        return listNotifiesByType(param);
      }
    },
    watch: {
      infoList () {
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
      BackTop,
      NoResult,
      MyMsgReply,
      MyMsgLike,
      MyMsgNotice
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myMessage";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

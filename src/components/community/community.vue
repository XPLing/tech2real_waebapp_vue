<template>
  <div class="g-community">
    <header class="g-header">
      <HeaderTitle :title="pageTitle"></HeaderTitle>
    </header>
    <div class="g-main">
      <scroll ref="scroll" :pullup="true" :data="communityList" :probeType="probeType" :listenScroll="listenScroll"
              @pullingUp="requestScrollData">
        <div>
          <ul class="community-list">
            <li class="item" v-for="(item, index) in communityList" :key="index">
              <div class="user-info"  @click.stop="selectItem(item)">
                <div class="avatar">
                  <img v-lazy="item.faceUrl">
                  <p class="name">{{item.nickname}}</p>
                </div>
                <p class="time">{{item.createTime | formatDate('yyyy-MM-dd')}}</p>
              </div>
              <div class="cont"  @click.stop="selectItem(item)">
                <community-cont :data="item"></community-cont>
              </div>
              <div class="tools">
                <p class="item comment"  @click.stop="selectItem(item)"><i class="icon c-icon-comment-square"></i>{{item.replyCount}}</p>
                <p class="item like" @click.stop="like(item)" :class="{'active': item.isLike === 'Y'}"><i
                  class="icon c-icon-like"></i>{{item.likeCount}}</p>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
    <router-link class="add-comment" :to="{path: `commentform`}" append>
      <i class="icon c-icon-pencil"></i>
    </router-link>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
    <keep-alive>
      <router-view v-if="isRouterAlive" @update="update" :comment-form-placeholder="`@${placeholder}:`" :type="routerType"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import BackTop from 'base/backtop/backtop';
  import { listAllComments } from 'api/community';
  import { likeCommentV2 } from 'api/comment';
  import CommunityCont from 'base/community-cont/community-cont';
  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        toptipTxt: '',
        pageTitle: '社群',
        probeType: 2,
        listenScroll: true,
        communityList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        isRouterAlive: true,
        placeholder: '你想聊点什么？',
        routerType: 'comment'
      };
    },
    created () {
      this.requestScrollData();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      like (data) {
        if (data.isLike === 'N' && !this.likeFlag) {
          this.likeFlag = true;
          this._likeCommentV2(data.id).then((res) => {
            this.likeFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return false;
              }
              data.isLike = 'Y';
              data.likeCount = data.likeCount + 1;
            }
          }, erro => {
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      update(){
        this.noMore = false;
        this.requestMoreFlag = false;
        this.requestPage = 1;
        this.communityList = null;
        this.requestScrollData();
      },
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      selectItem(data){
        this.$router.push({
          path: `${data.id}`,
          append: true
        });
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listAllComments(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.communityList) {
                  this.communityList = this.communityList.concat(res.result);
                } else {
                  this.communityList = res.result;
                }
                this.requestPage = this.requestPage + 1;
              } else {
                this.noMore = true;
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
      _likeCommentV2 (id) {
        var param = {
          isLike: 'Y',
          clientType: 1,
          type: 1,
          userGuid: this.userGuid,
          targetId: id
        };
        return likeCommentV2(param);
      },
      _listAllComments (page) {
        var param = {
          type: 4,
          page: page,
          limitSize: 10,
          userGuid: this.userGuid
        };
        return listAllComments(param);
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
      CommunityCont
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./community";

</style>

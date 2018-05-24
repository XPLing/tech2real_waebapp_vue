<template>
  <transition name="slide">
    <div class="g-tag-list">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll" class="tag-detail-content" :data="teacherList" :pullup="true"
                @pullingUp="requestCourses">
          <div>
            <div class="g-teacher">
              <ul class="teacher-list">
                <li class="teacher-item" v-for="(item, index) in teacherList" :key="index">
                  <router-link :to="{path: `/train/teacherdetail/${item.id}`}">
                    <div class="avatar">
                      <img  v-lazy="item.faceUrl || defaultAvatar" >
                    </div>
                    <div class="detail">
                      <p class="name">{{item.name}}</p>
                      <p class="career">{{item.career}}</p>
                      <p class="intro">{{item.brief}}</p>
                    </div>
                  </router-link>

                </li>
              </ul>
              <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : loadingMore}}</p>
            </div>
            <div class="feedback">
              <p class="txt">如果您也想成为导师？</p>
              <a class="btn" href="http://cn.mikecrm.com/bwfUSOH">
                点击申请
              </a>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { listTeachers } from 'api/train';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '导师列表',
        teacherList: null,
        requestMoreFlag: false,
        noMore: false,
        loadingMore: '加载中。。。',
        noMoreStr: '没有更多了~',
        teacherPage: 1,
        noResult: '暂无课程~~',
        defaultAvatar: require('assets/image/defaultAvatar.png')
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this.requestCourses()
    },
    mounted () {
    },
    methods: {
      requestCourses () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listTeachers(this.teacherPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.teacherList) {
                  this.teacherList = this.teacherList.concat(res.result);
                } else {
                  this.teacherList = res.result;
                }
                this.teacherPage = this.teacherPage + 1;
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
      _listTeachers (page) {
        var param = {
          productGuid: this.productGuid,
          page: page
        };
        return listTeachers(param);
      }
    },
    watch: {
      courseIntro () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      teacherList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      HeaderTitle,
      TopTip,
      Scroll
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./teacherlist";

</style>

<template>
  <transition name="slide">
    <div class="g-tag-list">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll" class="tag-detail-content" :data="tagList" :probeType="2">
          <div>
            <div class="g-tag">
              <ul class="course-list" v-if="tagList && tagList.length>0">
                <li class="course-item" v-for="(item, index) in tagList" :key="index">
                  <p class="title">{{item.title}}</p>
                  <ul class="tag-list">
                    <li class="tag-item needsclick" v-for="(titem, tindex) in item.tagList" :key="tindex">
                      <router-link :to="{path: `/train/all/tagdetail/${titem.id}`}">
                        {{titem.name}}
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
              <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : loadingMore}}</p>
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
  import { listTagContainers } from 'api/train';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import CourseItem from 'base/course-item/course-item';

  export default {
    data () {
      return {
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
    beforeRouteLeave (to, from, next) {
      console.log(to);
      next();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
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
    },
    mounted () {
    },
    methods: {
      _listTagContainers (page) {
        var param = {
          productGuid: this.productGuid
        };
        return listTagContainers(param);
      }
    },
    watch: {
      courseIntro () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      courseList () {
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

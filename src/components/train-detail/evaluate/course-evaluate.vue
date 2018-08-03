<template>
  <div class="g-course-evaluate" :class="{'joined':this.appliedState>0}">
    <div class="operate">
      <div class="title">
        <span>对该课程的评价</span>
        <p class="tools" @click="evaluate">编辑</p>
      </div>
      <div class="score">
        <star :score="score/2" :size="36"></star>
      </div>
    </div>
    <div class="evaluate-list">
      <scroll ref="scroll" class="train-content" :pullup="true" :data="requestScrollDataList"
              @pullingUp="requestScrollData">
        <div>
          <ul class="list" v-if="requestScrollDataList && requestScrollDataList.length>0">
            <li is="evaluate-item" v-for="(item, index) in requestScrollDataList" :key="index" @like="like"
                :data="item"></li>
          </ul>
          <div class="no-result" v-else>
            <no-result :title="'没有找到您要的内容'"></no-result>
          </div>
          <p v-show="requestMoreFlag || noMore" class="request-result">{{noMore ? noMoreStr : noResult}}</p>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { listEvaluatesByTargetId, addEvaluate } from 'api/courseDetail';
  import { likeCommentV2 } from 'api/comment';
  import { mapGetters } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import EvaluateItem from 'base/evaluate-item/evaluate-item';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import Star from 'base/star/star';

  export default {
    props: {
      appliedState: {
        type: Number,
        default: 0
      },
      courseData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        toptipTxt: '',
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1,
        requestScrollDataList: null,
        evaluated: false,
        evaluateCount: 0,
        myEvaluate: null,
        score: 0
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
      this.evaluateCount = this.courseData.evaluateCount;
      this.evaluated = this.courseData.evaluated;
      if (this.evaluated) {
        this.myEvaluate = this.courseData.myEvaluate;
        this.score = this.myEvaluate.star;
      }
      this.requestScrollData();
    },
    mounted () {
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
      updata () {
        this.requestPage = 1;
        this.requestScrollDataList = null;
        this.noMore = false;
        this.requestMoreFlag = false;
        this.requestScrollData();
      },
      evaluate () {
        this.$router.push({
          path: `/train/${this.$route.params.id}/evaluateForm`
        });
      },
      requestScrollData () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listEvaluatesByTargetId(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.requestScrollDataList) {
                  this.requestScrollDataList = this.requestScrollDataList.concat(res.result);
                } else {
                  this.requestScrollDataList = res.result;
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
      _listEvaluatesByTargetId (page) {
        var param = {
          userGuid: this.userGuid,
          page: page,
          limitSize: 10,
          type: 1,
          id: this.$route.params.id,
          version: 1,
          clientType: 1
        };
        return listEvaluatesByTargetId(param);
      }
    },
    watch: {
      requestScrollDataList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      swiper,
      swiperSlide,
      TopTip,
      Loading,
      Scroll,
      NoResult,
      EvaluateItem,
      Star
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./course-evaluate";
</style>

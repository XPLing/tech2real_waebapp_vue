<template>
  <transition name="slide">
    <div class="g-train-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-search="hasSearch" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="g-video">
        <video v-if="videoUrl" controls
               :src="videoUrl"></video>
        <img v-if="courseData && courseData.chapterResult.result.length <= 0" :src="coverUrl">
      </div>
      <nav class="g-nav-wrapper">
        <TrainDetailTab></TrainDetailTab>
      </nav>
      <div class="g-main">
        <keep-alive>
          <router-view :product-guid="productGuid" :user-guid="userGuid" :course-data="courseData"
                       @setdata="setDatas" @changevideo="changeVideo"></router-view>
        </keep-alive>
      </div>
      <div class="g-join">
        <span class="price">0.00</span>
        <button class="btn">加入学习</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import TrainDetailTab from 'components/train-detail-tab/train-detail-tab';
  import { getCourseData } from 'api/courseDetail';
  import { commonVariable, ERR_OK } from 'api/config';

  export default {
    props: {
      productGuid: {
        type: String,
        default: commonVariable.productGuid
      },
      userGuid: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        courseID: 0,
        pageTitle: '课程详情',
        hasSearch: false,
        hasBack: true,
        courseData: null,
        videoUrl: null,
        coverUrl: null
      };
    },
    created () {
      this._getCourseID();
      this._getCourseData();
    },
    methods: {
      _getCourseID () {
        this.courseID = this.$route.params.id;
      },
      _getCourseData () {
        var param = {
          id: this.courseID,
          productGuid: this.productGuid,
          userGuid: this.userGuid
        };
        getCourseData(param).then((res) => {
          this.courseData = res;
          this.videoUrl = res.chapterResult.result[0].chapters[0].videoUrl;
          this.coverUrl = res.courseResult.result.coverUrl;
        });
      },
      setDatas (key, val, index, dataName) {
        console.log(111);
        // var newData = Object.assign({},)
        console.log(this.courseData.chapterResult.result[1]);
        this.$set(this.courseData.chapterResult.result[index], key, val);

      },
      changeVideo (url) {
        if (url === this.videoUrl) {
          return;
        }
        this.videoUrl = url;
        console.log(url);
      }
    },
    components: {
      HeaderTitle,
      TrainDetailTab
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train-detail";

</style>

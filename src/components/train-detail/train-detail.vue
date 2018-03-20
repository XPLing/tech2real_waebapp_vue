<template>
  <transition name="slide">
    <div class="g-train-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-search="hasSearch" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="g-video">
        <video src="" width="100%"></video>
      </div>
      <nav class="g-nav-wrapper">
        <TrainDetailTab></TrainDetailTab>
      </nav>
      <router-view></router-view>
      <div class="g-join">
        <span class="price">0.00</span><button class="btn">加入学习</button>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import TrainDetailTab from 'components/train-detail-tab/train-detail-tab';
  export default {
    data(){
      return {
        courseID: 0,
        pageTitle: "课程详情",
        hasSearch: false,
        hasBack: true
      }
    },
    created(){
      this.courseID = this.$route.params.id;
    },
    components: {
      HeaderTitle,
      TrainDetailTab
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/compile";
  @import "./train-detail";

</style>

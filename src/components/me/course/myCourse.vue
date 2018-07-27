<template>
  <transition name="slide">
    <div class="g-me-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-view">
        <subscribe></subscribe>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import subscribe from 'components/study-subscribe/study-subscribe';

  export default {
    data () {
      return {
        pageTitle: '我的课程',
        toptipTxt: ''
      };
    },
    created () {

    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {},
    watch: {},
    components: {
      HeaderTitle,
      TopTip,
      Loading,
      subscribe
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myCourse";
</style>

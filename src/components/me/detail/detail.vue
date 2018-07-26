<template>
  <transition name="slide">
    <div class="g-me-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-view">
        <transition name="slide" mode="out-in">
          <keep-alive>
            <component :is="currView"></component>
          </keep-alive>
        </transition>
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
  import MyActivity from 'components/myActivity/myActivity';

  export default {
    data () {
      return {
        currView: 'subscribe',
        pageTitle: '',
        toptipTxt: ''
      };
    },
    created () {
      this.currView = this.$route.params.view;
      this.pageTitle = this.$route.query.title;
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
      subscribe,
      MyActivity
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./detail";
</style>

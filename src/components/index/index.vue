<template>
  <div id="app" class="g-app-wrapper" @touchmove.prevent>
    <keep-alive :include="keepAliveList">
      <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
    <nav class="g-nav">
      <g-tab></g-tab>
    </nav>
  </div>
</template>

<script>
  import Tab from 'components/tab/tab';
  import { mapMutations } from 'vuex';
  import * as util from 'assets/js/util';

  export default {
    name: 'App',
    provide () {
      return {
        rootReload: this.reload
      };
    },
    data () {
      return {
        keepAliveList: /^KA_root/,
        isRouterAlive: true
      };
    },
    created () {
      this.recordSystemInfo();
    },
    activated () {

    },
    methods: {
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      ...mapMutations({
        recordSystemInfo: 'RECORD_SYSTEMINFO'
      })
    },
    components: {
      'g-tab': Tab
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./index";
</style>

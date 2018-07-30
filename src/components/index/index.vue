<template>
  <div id="app" class="g-app-wrapper">
    <router-view></router-view>
    <nav class="g-nav">
      <g-tab></g-tab>
    </nav>
  </div>
</template>

<script>
  import Tab from 'components/tab/tab';
  import { mapMutations } from 'vuex';

  export default {
    name: 'App',
    data () {
      return {};
    },
    created () {
    },
    activated () {
      console.log('activated');
    },
    methods: {

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

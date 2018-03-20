<template>
  <div id="app" class="g-app-wrapper">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <nav class="g-nav">
      <g-tab></g-tab>
    </nav>
  </div>
</template>

<script>
  import Tab from 'components/tab/tab';
  export default {
    name: 'App',
    components: {
      'g-tab': Tab
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/compile";
  @import "./index";
</style>

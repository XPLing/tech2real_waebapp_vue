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
  import { getUserGuid, setUserGuid, getProductGuid } from 'assets/js/common';
  import { mapMutations } from 'vuex';
  export default {
    name: 'App',
    data(){
      return {}
    },
    created(){
      this.setUserGuid();
    },
    activated(){
      console.log('activated');
    },
    methods: {
      ...mapMutations({
        setUserGuid: 'SET_USERGUID'
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

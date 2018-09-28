<template>
  <div class="g-tab">
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/info'}">
      <i class="icon c-icon-info-o"></i>
      <span class="tab-link">资讯</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train'}">
      <i class="icon c-icon-study"></i>
      <span class="tab-link">培训</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/community'}">
      <i class="icon c-icon-community"></i>
      <span class="tab-link">社群</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/activity'}">
      <i class="icon c-icon-find"></i>
      <span class="tab-link">活动</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/me'}">
      <i class="icon c-icon-me"></i>
      <span class="tab-link">我的</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  import { routerPrefix } from 'assets/js/util';

  export default {
    data () {
      return {
        routerPrefix
      };
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./tab";

</style>

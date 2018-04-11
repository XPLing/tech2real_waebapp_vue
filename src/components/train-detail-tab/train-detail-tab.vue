<template>
  <div class="g-train-detail-tab">
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/intro'}" replace>
      <span class="tab-link">课程</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/chapters'}" replace>
      <span class="tab-link">章节</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/evaluate'}" replace>
      <span class="tab-link">评价</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/community'}" replace>
      <span class="tab-link">交流</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  import { routerPrefix } from 'assets/js/util';
  export default {
    data(){
      return {
        courseID: 0,
        routerPrefix
      }
    },
    created(){
      this.courseID = this.$route.params.id;
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train-detail-tab";

</style>

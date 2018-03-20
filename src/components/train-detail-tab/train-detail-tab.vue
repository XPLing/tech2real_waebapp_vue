<template>
  <div class="g-train-detail-tab">
    <router-link tag="li" class="tab-item" :to="{path:'/train/'+ courseID +'/intro'}" replace>
      <span class="tab-link">课程</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path:'/train/'+ courseID +'/chapters'}" replace>
      <span class="tab-link">章节</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path:'/train/'+ courseID +'/evaluate'}" replace>
      <span class="tab-link">评价</span>
    </router-link>
    <router-link tag="li" class="tab-item" :to="{path:'/train/'+ courseID +'/community'}" replace>
      <span class="tab-link">交流</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return {
        courseID: 0
      }
    },
    created(){
      this.courseID = this.$route.params.id;
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/compile";
  @import "./train-detail-tab";

</style>

<template>
  <div class="g-tab">
    <router-link tag="li" class="tab-item" to="/info">
      <i class="icon c-icon-info"></i>
      <span class="tab-link">资讯</span>
    </router-link>
    <router-link tag="li" class="tab-item" to="/train">
      <i class="icon c-icon-train"></i>
      <span class="tab-link">培训</span>
    </router-link>
    <router-link tag="li" class="tab-item" to="/community">
      <i class="icon c-icon-community"></i>
      <span class="tab-link">社群</span>
    </router-link>
    <router-link tag="li" class="tab-item" to="/activity">
      <i class="icon c-icon-activity"></i>
      <span class="tab-link">活动</span>
    </router-link>
    <router-link tag="li" class="tab-item" to="/me">
      <i class="icon c-icon-me"></i>
      <span class="tab-link">我的</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/compile";
  @import "./tab";

</style>

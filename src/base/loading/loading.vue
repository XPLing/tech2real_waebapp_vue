<template>
  <div class="loading">
    <img class="loadingIcon" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/variable";
  @import "loading";
</style>

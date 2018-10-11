<template>
  <div class="no-result">
    <div class="no-result-wrapper">
      <div class="no-result-icon"></div>
      <p class="no-result-text">{{title}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '由于网络信号不佳，请刷新页面重新加载！'
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "page-loadfail";
</style>

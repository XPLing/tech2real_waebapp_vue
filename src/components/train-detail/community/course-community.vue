<template>
  <div class="g-course-intro" :class="{'joined':this.appliedState===1}"></div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        appliedState: {
          type: Number,
          default: 0
        }
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./coursecommunity";
</style>

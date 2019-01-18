<template>
    <transition-group name="slide">
        <div class="g-recommend" :key="'gRecommend'">
            CCC
        </div>
        <router-link to="/testB" :key="'testB'"></router-link>
    </transition-group>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./me";

</style>

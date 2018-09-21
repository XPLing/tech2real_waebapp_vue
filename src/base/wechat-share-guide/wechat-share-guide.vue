<template>
  <transition name="confirm-fade">
    <div class="c-wechat-share-guide" v-show="showFlag">
      微信引导层
      <i class="icon fa fa-times" @click="hide"></i>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        showFlag: false
      };
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./wechat-share-guide";
</style>

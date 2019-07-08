<template>
  <transition name="confirm-fade">
    <div class="c-wechat-share-guide" v-show="showFlag">
      <p class="top">
        <img src="./top.png" @click.prevent>
      </p>
      <div class="btnbox">
        <img class="btn" src="./btn.png" @click.prevent="hide">
        <img class="line" src="./line.png" @click.prevent>
      </div>
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

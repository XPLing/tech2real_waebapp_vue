<template>
  <transition name="loading-fade">
    <div class="loading" v-if="showFlag">
      <div class="bg"></div>
      <div class="cont-wrapper">
        <div class="cont">
          <img class="loadingIcon" src="./loading.gif">
          <p class="desc">{{title}}</p>
        </div>

      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    },
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
      },
      cancel () {
        this.hide();
        this.$emit('cancel');
      },
      confirm () {
        this.hide();
        this.$emit('confirm');
      }
    }
  };
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "loading";
</style>

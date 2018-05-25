<template>
  <div class="g-mask" @click="clickHandle" v-show="showFlag">
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      clickHide: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showFlag: false
      };
    },
    methods: {
      clickHandle () {
        if (this.clickHide) {
          this.hide();
        }
        this.$emit('clickMask');
      },
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./mask";
</style>

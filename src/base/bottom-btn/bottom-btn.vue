<template>
  <div class="g-bottom-btn" v-show="showFlag">
    <span class="price">{{price == 0 ? "免费" : price}}</span>
    <button class="btn" @click="confirm">{{btnstr}}</button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      btnstr: {
        type: String,
        default: ''
      },
      price: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        showFlag: true
      };
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      confirm () {
        this.$emit('confirm');
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "bottom-btn";
</style>

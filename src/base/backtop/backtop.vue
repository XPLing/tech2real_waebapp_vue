<template>
  <transition name="fade">
    <div v-show="backTopShowFlag" class="fixed-right-btn" @click="backTop">
      <button class="back-top btn-item">
        <span class="fa fa-chevron-up"></span>
      </button>
      <!--<a href="http://cn.mikecrm.com/1uLCgn3" class="btn-item sign-up">入驻</a>-->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import * as util from 'assets/js/util';

  export default {
    props: {

    },
    data() {
      return {
        backTopShowFlag: false,
        target: null
      };
    },
    computed: {},
    mounted() {

    },
    methods: {
      backTop() {
        this.$emit('backTop');
      },
      showIcon() {
        this.backTopShowFlag = true;
      },
      hideIcon() {
        this.backTopShowFlag = false;
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./backtop";
</style>

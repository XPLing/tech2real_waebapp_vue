<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      delay: {
        type: Number,
        default: 2000
      },
      isAutoHide: {
        type: Boolean,
        default: true
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
        clearTimeout(this.timer);
        if (this.isAutoHide) {
          this.timer = setTimeout(() => {
            this.hide();
          }, this.delay);
        }
      },
      hide () {
        this.showFlag = false;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "toptip";
</style>

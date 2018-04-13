<template>
  <div class="g-recommend">
    <input type="radio" name="select" value="a" @click="switching('v-a')">A
    <input type="radio" name="select" value="b" @click="switching('v-b')">B
    <transition name="fade" mode="out-in">
      <component :is="currView"></component>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import AA from 'components/testA/me';
  import BB from 'components/testB/me';

  export default {
    data () {
      return {
        currView: 'v-a'
      };
    },
    methods: {
      switching (val) {
        this.currView = val;
      }
    },
    components: {
      'v-a': AA,
      'v-b': BB
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./info";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

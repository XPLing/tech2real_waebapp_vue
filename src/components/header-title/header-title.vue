<template>
  <div class="g-header-title">
    <i v-if="hasBack" class="fa fa-angle-left left" @click="back" aria-hidden="true"></i>
    <span class="title">{{title}}</span>
    <i v-if="hasSearch" class="fa c-icon-search right" aria-hidden="true"></i>
    <i v-if="hasShare" class="fa c-icon-share right" aria-hidden="true" @click="share"></i>
    <i v-if="hasOperate" class="operate right" @click="operateHandle">{{operateStr}}</i>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      operateStr: {
        type: String,
        default: ''
      },
      backHandle: {
        type: String,
        default: 'default'
      },
      hasBack: {
        type: Boolean,
        default: false
      },
      hasShare: {
        type: Boolean,
        default: false
      },
      hasOperate: {
        type: Boolean,
        default: false
      },
      hasSearch: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {};
    },
    methods: {
      back () {
        if (this.backHandle === 'default') {
          this.$router.back();
        }
        this.$emit('back');
      },
      operateHandle () {
        this.$emit('operate');
      },
      share () {
        this.$emit('share');
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./header-title";

</style>

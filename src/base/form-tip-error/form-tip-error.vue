<template>
  <transition name="fade">
    <div class="form-tip" v-show="errors.has(tipName)">
      <p>{{ errors.first(tipName)}}</p>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    inject: ['$validator'],
    props: {
      tipName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    created(){
    },
    methods: {

    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "form-tip-error";
</style>

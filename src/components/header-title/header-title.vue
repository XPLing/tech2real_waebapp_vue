<template>
  <div class="g-header-title">
    <i v-if="hasBack" class="fa fa-angle-left left" @click="back" aria-hidden="true"></i>
    <span>{{title}}</span>
    <i v-if="hasSearch" class="fa fa-search right" aria-hidden="true"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      hasBack: {
        type: Boolean,
        default: false
      },
      hasSearch: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {}
    },
    methods: {
      back(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../common/scss/compile";
  @import "./header-title";

</style>

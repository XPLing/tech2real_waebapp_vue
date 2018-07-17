<template>
  <div class="c-share-link">
    <img class="cover" :src="data.pictureUrl">
    <p class="title">{{data.listTitle}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
      };
    },
    created () {
    },
    methods: {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./link-item";
</style>

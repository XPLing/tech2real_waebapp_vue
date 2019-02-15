<template>
  <div class="c-share-link">
    <img class="cover" v-lazy="{
          src: data.cover,
          error: lazy.error,
          loading: lazy.loading
        }">
    <p class="title">{{data.title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  // shareType; //1 课程，2 资讯文章，3 活动，10 其他；
  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        }
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

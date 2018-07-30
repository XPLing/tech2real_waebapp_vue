<template>
  <li class="c-info-list-item c-media" @click.stop="selectItem(info)">
    <div class="media-left">
      <img v-lazy="{
          src: info.pictureUrl,
          error: lazy.error,
          loading: lazy.loading
        }" alt="">
    </div>
    <div class="media-body">
      <p class="title">{{info.listTitle}}</p>
      <p class="info">
        <span>{{ info.source }}</span>
      </p>
    </div>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      info: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          src: this.info.coverUrl,
          error: require('./info-loading.jpg'),
          loading: require('./info-loading.jpg')
        }
      };
    },
    created () {
    },
    methods: {
      selectItem (info) {
        this.$emit('selectInfo', info);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./info-item-left";
</style>

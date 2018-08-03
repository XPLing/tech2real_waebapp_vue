<template>
  <div class="c-notice-item c-media" @click.stop="selectItem(data)">
    <div class="media-left">
      <img src="./yinjianLogo.png">
    </div>
    <div class="media-body" :class="{readed: data.isRead}">
      <p class="info">
        <span class="name">硬见</span>
        <span class="time">{{data.updateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
      </p>
      <div class="cont-wrap">
        <p class="tip">{{data.title}}</p>
        <p class="cont">{{data.content}}</p>
      </div>
    </div>
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
      return {};
    },
    created () {
    },
    methods: {
      selectItem (data) {
        this.$emit('selectItem', data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myMsg-notice";
</style>

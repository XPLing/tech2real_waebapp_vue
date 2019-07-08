<template>
  <div class="c-like-item c-media" @click.stop="selectItem(data, detail)">
    <div class="media-left" v-if="detail">
      <img v-lazy="detail.likeAvatar" alt="">
    </div>
    <div class="media-body" v-if="detail" :class="{readed: data.isRead}">
      <p class="info">
        <span class="name">{{detail.likeNickname}}</span>
        <span class="time">{{data.updateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
      </p>
      <div class="cont-wrap">
        <p class="cont">赞了我</p>
        <p class="reply-content">我的评论：{{detail.commentContent}}</p>
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
      return {
        detail: null
      };
    },
    created () {
      if (this.data.params) {
        this.detail = JSON.parse(this.data.params);
      }
    },
    methods: {
      selectItem (data, detail) {
        this.$emit('selectItem', data, detail);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myMsg-like";
</style>

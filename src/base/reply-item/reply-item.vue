<template>
  <li class="c-reply-list-item c-media" @click.stop="selectItem(reply)">
    <div class="media-left">
      <img v-lazy="reply.faceUrl" alt="">
    </div>
    <div class="media-body">
      <p class="info">
        <span class="name">{{reply.nickname}}</span>

      </p>
      <p class="cont">
        <span>{{ reply.content }}</span>
      </p>
      <div class="operate">
        <p class="time">{{reply.createTime | formatDate('yyyy-MM-dd')}}</p>
        <p class="tool">
          <span class="item like" @click.stop="like(reply)"><i class="icon c-icon-like" :class="{'active': reply.isLiked==='Y'}"></i>{{reply.likeCount}}</span>
        </p>
      </div>
    </div>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      reply: {
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
      selectItem (replyItem) {
        this.$emit('selectReplyItem', replyItem);
      },
      like(replyItem){
        this.$emit('like', replyItem);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./reply-item";
</style>

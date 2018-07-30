<template>
  <li class="c-reply-list-item c-media" @click.stop="selectItem(reply)">
    <div class="media-left">
      <img v-lazy="reply.faceUrl" alt="">
    </div>
    <div class="media-body">
      <p class="info">
        <span class="name">{{reply.nickname}}</span>
      </p>
      <div class="cont-wrap">
        <div v-if="reply.replyId">
          <p class="reply-content">@{{reply.replyNickname}}：{{reply.replyContent}}</p>
          <p class="cont">{{reply.content}}</p>
        </div>
        <p class="cont" v-else>{{reply.content}}</p>
        <div class="gallery" :class="imgs.length>=3?'three':imgs.length===1?'one':'two'" v-if="imgs&&imgs.length>0">
          <img :src="item" v-for="(item, index) in imgs" :key="index">
        </div>
      </div>
      <div class="operate">
        <p class="time">{{reply.createTime | formatDate('yyyy-MM-dd')}}</p>
        <p class="tool">
          <span class="item like" @click.stop="like(reply)"><i class="icon c-icon-like"
                                                               :class="{'active': reply.isLiked==='Y'}"></i>{{reply.likeCount}}</span>
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
        imgs: null
      };
    },
    created () {
      if (this.reply.imgUrls) {
        this.imgs = this.reply.imgUrls.split(',');
      }
    },
    methods: {
      selectItem (replyItem) {
        this.$emit('selectReplyItem', replyItem);
      },
      like (replyItem) {
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

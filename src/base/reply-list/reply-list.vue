<template>
  <ul class="g-reply-list">
    <reply-item :reply="item" v-for="(item, index) in replyList" :key="index"
                    @selectReplyItem="selectReply" @like="like"></reply-item>
  </ul>
</template>

<script type="text/ecmascript-6">
  import ReplyItem from 'base/reply-item/reply-item';

  export default {
    props: {
      replyList: {
        type: Array,
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
      selectReply (replyItem) {
        this.$emit('selectReply', replyItem);
      },
      like(replyItem){
        this.$emit('like', replyItem);
      }
    },
    components: {
      ReplyItem
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./reply-list";
</style>

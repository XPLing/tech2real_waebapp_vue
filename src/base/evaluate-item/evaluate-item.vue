<template>
  <div class="c-evaluate-item c-media" @click.stop="selectItem(data)">
    <div class="media-left">
      <img v-lazy="data.faceUrl">
    </div>
    <div class="media-body">
      <div class="info">
        <span class="name">{{data.nickname}}</span>
        <div class="score">
          <star :score="data.star/2" :size="24"></star>
        </div>
      </div>
      <div class="cont-wrap">
        <p class="cont">{{data.content}}</p>
      </div>
      <div class="operate">
        <p class="time">{{data.createTime | formatDate('yyyy-MM-dd')}}</p>
        <p class="tool">
          <span class="item like" @click.stop="like(data)"><i class="icon c-icon-like"
                                                              :class="{'active': data.isLike==='Y'}"></i>{{data.likeCount}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from 'base/star/star';

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
        this.$emit('selectReplyItem', data);
      },
      like (data) {
        this.$emit('like', data);
      }
    },
    components: {
      Star
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./evaluate-item";
</style>

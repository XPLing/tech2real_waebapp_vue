<template>
  <li class="c-community-list-item c-media" @click.stop="selectItem(community)">
    <div class="media-left">
      <img v-lazy="community.faceUrl" alt="">
    </div>
    <div class="media-body">
      <p class="info">
        <span class="name">{{community.nickname}}</span>

      </p>
      <p class="cont">
        <span>{{ community.content }}</span>
      </p>
      <div class="operate">
        <p class="time">{{community.createTime | formatDate('yyyy-MM-dd')}}</p>
        <p class="tool">
          <span class="item comment"><i class="icon c-icon-comment-square"></i>{{community.replyCount}}</span>
          <span class="item like" @click.stop="like(community)"><i class="icon c-icon-like" :class="{'active': community.isLike==='Y'}"></i>{{community.likeCount}}</span>
        </p>
      </div>
    </div>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      community: {
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
      selectItem (communityItem) {
        this.$emit('selectCommunityItem', communityItem);
      },
      like(communityItem){
        this.$emit('like', communityItem);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./community-item";
</style>

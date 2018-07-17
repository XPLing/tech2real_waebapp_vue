<template>
  <div class="c-community-list-item" @click.stop="selectItem(community)">
    <div class="user-info">
      <div class="avatar">
        <img v-lazy="community.faceUrl">
        <p class="name">{{community.nickname}}</p>
      </div>
    </div>
    <div class="cont">
      <community-cont :data="community"></community-cont>
    </div>
    <div class="operate">
      <p class="time">{{community.createTime | formatDate('yyyy-MM-dd')}}</p>
      <p class="tool">
        <span class="item comment"><i class="icon c-icon-comment-square"></i>{{community.replyCount}}</span>
        <span class="item like" @click.stop="like(community)"><i class="icon c-icon-like" :class="{'active': community.isLike==='Y'}"></i>{{community.likeCount}}</span>
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CommunityCont from 'base/community-cont/community-cont';

  export default {
    props: {
      community: {
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
      selectItem (communityItem) {
        this.$emit('selectItem', communityItem);
      },
      like (communityItem) {
        this.$emit('like', communityItem);
      }
    },
    components: {
      CommunityCont
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./community-club-item";
</style>

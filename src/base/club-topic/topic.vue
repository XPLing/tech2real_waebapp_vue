<template>
  <ul class="c-topic-list">
    <li class="item" v-for="(item, index) in dataList" :key="index">
      <div class="user-info"  @click.stop="selectItem(item)">
        <div class="avatar">
          <img v-lazy="item.faceUrl">
          <p class="name">{{item.nickname}}</p>
        </div>
        <p class="time">{{item.createTime | formatDate('yyyy-MM-dd')}}</p>
      </div>
      <div class="cont"  @click.stop="selectItem(item)">
        <community-cont :data="item"></community-cont>
      </div>
      <div class="tools">
        <p class="item comment"  @click.stop="selectItem(item)"><i class="icon c-icon-comment-square"></i>{{item.replyCount}}</p>
        <p class="item like" @click.stop="like(item)" :class="{'active': item.isLike === 'Y'}"><i
          class="icon c-icon-like"></i>{{item.likeCount}}</p>
      </div>
    </li>
  </ul>

</template>

<script type="text/ecmascript-6">
  import CommunityCont from 'base/community-cont/community-cont';

  export default {
    props: {
      dataList: {
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
      selectItem (data) {
        this.$emit('selectItem', data);
      },
      like(data){
        this.$emit('like', data);
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
  @import "./topic";
</style>

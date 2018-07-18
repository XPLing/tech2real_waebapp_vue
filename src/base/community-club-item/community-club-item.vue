<template>
  <div class="c-community-list-item">
    <div class="user-info" @click.stop="selectItem(community)">
      <div class="avatar">
        <img v-lazy="community.faceUrl">
        <p class="name">{{community.nickname}}</p>
      </div>
    </div>
    <div class="cont" @click.stop="deleteItem(community)">
      <community-cont :data="community"></community-cont>
    </div>
    <div class="club" @click.stop="selectClub">
      <p class="info">
        <img :src="community.club.logoUrl">
        <span class="name">{{community.club.name}}</span>
      </p>
      <i class="icon c-icon-angle-right"></i>
    </div>
    <div class="operate">
      <p class="time">
        <span>
          {{community.createTime | formatDate('yyyy-MM-dd')}}
        </span>
        <span class="delete" v-if="community.userGuid===userGuid" @click.stop="deleteItem">删除</span>
      </p>
      <p class="tool">
        <span class="item comment" @click.stop="selectItem(community)"><i class="icon c-icon-comment-square"></i>{{community.replyCount}}</span>
        <span class="item like" @click.stop="like(community)"><i class="icon c-icon-like" :class="{'active': community.isLike==='Y'}"></i>{{community.likeCount}}</span>
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CommunityCont from 'base/community-cont/community-cont';
  import { mapGetters } from 'vuex';
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
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    created () {
    },
    methods: {
      selectClub(){
        console.log('selectClub');
        this.$emit('selectClub', this.community);
      },
      selectItem (communityItem) {
        this.$emit('selectItem', communityItem);
      },
      like (communityItem) {
        this.$emit('like', communityItem);
      },
      deleteItem () {
        console.log('deleteItem');
        this.$emit('deleteComment', this.community);
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

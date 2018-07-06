<template>
  <ul class="g-community-list">
    <community-item :community="item" v-for="(item, index) in communityList" :key="index"
                    @selectCommunityItem="selectCommunity" @like="like"></community-item>
  </ul>
</template>

<script type="text/ecmascript-6">
  import CommunityItem from 'base/community-item/community-item';

  export default {
    props: {
      communityList: {
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
      selectCommunity (communityItem) {
        this.$emit('selectCommunity', communityItem);
      },
      like(communityItem){
        this.$emit('like', communityItem);
      }
    },
    components: {
      CommunityItem
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./community-list";
</style>

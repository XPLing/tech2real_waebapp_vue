<template>
  <div class="c-community-cont">
    <div class="desc">
      {{data.content | ellipsis(150)}}
    </div>
    <div class="link" v-if="data.shareFlag==='Y'">
      <share-link :data="data"></share-link>
    </div>
    <div class="gallery" :class="data.imgs.length>=3?'three':data.imgs.length===1?'one':'two'" v-if="data.imgs && data.imgs.length>0">
      <img v-for="(item, index) in data.imgs" :key="index" v-lazy="{
          src: item.url,
          error: lazy.error,
          loading: lazy.loading
        }">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ShareLink from 'base/share/link/link-item';

  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        }
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
    },
    components: {
      ShareLink
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./community-cont";
</style>

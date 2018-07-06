<template>
  <div class="g-club-list">
    <ul class="list">
      <clubs-item :community="item" v-for="(item, index) in clubList" :key="index"
                      @selectClub="selectClub">
      </clubs-item>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import ClubsItem from 'base/clubs-item/clubs-item';
  export default {
    props: {
      clubList: {
        type: Array,
        default: null
      }
    },
    methods: {
      selectClub (id) {
        this.$emit('selectClub', id);
      }
    },
    components: {
      ClubsItem
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "clubs-list";
</style>

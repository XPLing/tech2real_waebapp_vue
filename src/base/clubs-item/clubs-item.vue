<template>
  <li class="c-club-list-item c-media" @click.stop="selectItem(club)">
    <div class="media-left">
      <img v-lazy="club.logoUrl" alt="">
    </div>
    <div class="media-body">
      <p class="title">{{club.name}}</p>
      <p class="brief">{{club.profile  | ellipsis(28)}}</p>
    </div>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      club: {
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
      selectItem (club) {
        this.$emit('selectClub', club);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "clubs-item";
</style>

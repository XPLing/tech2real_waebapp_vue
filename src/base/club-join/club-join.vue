<template>
  <ul class="c-club-list">
    <li class="item cont" v-for="(item, index) in data" :key="index" @click="selectItem(item)">
      <p class="avatar">
        <img :src="item.logoUrl">
      </p>
      <div class="desc">
        <p class="title">{{item.name}}</p>
        <p class="intro">{{item.profile | ellipsis(28)}}</p>
      </div>
      <p class="btn" :class="{'joined': item.userClubId==1}" @click.stop="operate(item)" v-if="joinShowFlag">
        <i class="icon" v-if="item.userClubId !== 1">+</i>
        <span>{{item.userClubId==1?'已加入':'加入'}}</span>
      </p>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      data: {
        type: Array,
        default: null
      },
      joinShowFlag: {
        type: Boolean,
        default: true
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
      operate (data) {
        this.$emit('join', data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./club-join";
</style>

<template>
  <div class="g-header-title-tab">
    <div class="wrapper">
      <i v-if="hasBack" class="fa fa-angle-left left" @click="back" aria-hidden="true"></i>
      <span v-for="(item, index) in title" :key="index" :class="currentIndex===index?'active':''" @click="toggleTab(item, index)">{{item.title}}</span>
      <i v-if="hasSearch" class="fa c-icon-search right" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: Array,
        default(){
          return []
        }
      },
      hasBack: {
        type: Boolean,
        default: false
      },
      hasSearch: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentIndex: 0
      }
    },
    methods: {
      back(){
        this.$router.back()
      },
      toggleTab(item, index){
        this.currentIndex = index;
        this.$emit('toggle-tab', item, index);
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./header-title-tab";

</style>

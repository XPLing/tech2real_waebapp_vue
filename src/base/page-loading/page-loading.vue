<template>
  <transition name="loading-fade">
    <div class="loading" :class="isLocal?'local':''" v-if="showFlag">
      <div class="bg"></div>
      <div class="cont-wrapper">
        <div class="cont" :class="type">
          <img class="loadingIcon" src="./loading.gif">
          <p class="desc">{{title}}</p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '页面加载中...'
      },
      type: {
        type: String,
        default: 'normal'
      },
      isLocal: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        showFlag: true
      };
    },
    created(){
      console.log('page-loading');
    },
    activated(){

    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      }
    }
  };
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "page-loading";
</style>

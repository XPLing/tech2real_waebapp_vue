<template>
  <div class="c-share" :class="{'active':showFlag}">
    <div v-show="showFlag">
      <div class="bg-layer" @click="hide"></div>
      <transition name="drop-down">
        <div v-show="showFlag" class="share-wrapper">
          <div class="cont">
            <div v-if="!noSelf" class="to-clubs" @click="share(-1)">
              <div class="avatar">
                <img src="./clubs.png">
              </div>
              <div class="desc">
                <p class="title">分享到硬见社群</p>
                <p class="subtitle">与工程师们分享您的想法</p>
              </div>
            </div>
            <div class="split">分享到社交平台</div>
            <div class="to-vendor">
              <img class="item" src="./wechat.png" @click="share(1)">
              <img class="item" src="./qq_sapce.png" @click="share(2)">
              <img class="item" src="./qq.png" @click="share(3)">
              <img class="item" src="./weibo.png" @click="share(4)">
            </div>
          </div>
          <div class="operate">
            <button class="btn cancel" @click="cancel">取消</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // shareType; // -1 社群，1 微信,2 qq空间，3 qq，4 微博；
  export default {
    props: {
      data: {
        type: Object,
        default: null
      },
      noSelf: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showFlag: false
      };
    },
    created () {

    },
    methods: {
      hide () {
        this.showFlag = false;
      },
      show () {
        this.showFlag = true;
      },
      cancel () {
        this.hide();
        this.$emit('cancel');
      },
      share (data) {
        this.hide();
        this.$emit('share', data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./share";
</style>

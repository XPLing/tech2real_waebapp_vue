<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper" :class="layoutType==='vertical'?'vertical':'horizontal'">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div v-if="!isDialog" @click="cancel" class="operate-btn btn-cancel">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn btn-confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      isDialog: {
        type: Boolean,
        default: false
      },
      layoutType: {
        type: String,
        default: 'horizontal'
      }
    },
    data () {
      return {
        showFlag: false
      };
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      cancel () {
        this.hide();
        this.$emit('cancel');
      },
      confirm () {
        this.hide();
        this.$emit('confirm');
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "confirm";
</style>

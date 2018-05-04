<template>
  <div class="g-bottom-btn-full" v-show="showFlag">
    <button class="btn" @click="confirm" :class="{'disable':isActiving}">{{submitBtnStr}}</button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      btnstr: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showFlag: true,
        isActiving: false
      };
    },
    computed: {
      submitBtnStr () {
        return this.isActiving ? '提交中...' : this.btnstr;
      }
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      changeSubmitBtn (flag) {
        if (flag !== null) {
          this.isActiving = flag;
        }
      },
      confirm () {
        this.$emit('bottomconfirm');
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./bottom-btn-full";
</style>

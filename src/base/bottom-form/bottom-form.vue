<template>
  <div class="g-edit-wrapper" v-show="showFlag">
    <div class="mask" @click.stop="clickMask"></div>
    <transition name="drop-down">
      <div class="flex-layer">
        <div class="cont">
          <textarea v-model="cont" cols="30" rows="10"></textarea>
        </div>
        <div class="control-btn">
          <button class="item cancel" @click="cancel">取消</button>
          <button class="item confirm" @click="confirm">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      initCont: ''
    },
    data () {
      return {
        showFlag: false,
        cont: ''
      };
    },
    created () {
      this.cont = this.initCont || '';
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
        this.$emit('confirm', this.cont);
      },
      clickMask () {
        this.hide();
        this.$emit('clickMask');
      }
    },
    components: {
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./bottom-form";
</style>

<template>
  <div class="g-edit-wrapper" v-show="showFlag">
    <transition name="drop-down">
      <div class="flex-layer">
        <div class="mask" @click.stop="clickMask"></div>
        <div class="cont">
          <textarea v-model="cont" cols="30" rows="10" @input="inputHandle"></textarea>
          <div class="limit" v-if="limitNum">{{currentNum}}/{{limitNum}}</div>
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
      initCont: '',
      limitNum: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        showFlag: false,
        cont: '',
        currentNum: 0
      };
    },
    created () {
      this.cont = this.initCont || '';
      this.currentNum = this.cont.length;
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      inputHandle () {
        if (this.limitNum && this.cont.length > this.limitNum) {
          this.cont = this.cont.substring(0, this.limitNum);
        }
        this.currentNum = this.cont.length;
        this.$emit('input');
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
    components: {}
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./bottom-form";
</style>

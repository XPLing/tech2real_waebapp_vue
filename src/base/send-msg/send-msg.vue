<template>
  <div class="g-send-msg" @click.stop="clickSend">
    <em>{{text}}</em>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      delay: {
        type: Number,
        default: 2000
      },
      initText: {
        type: String,
        default: '发送信息'
      }
    },
    data () {
      return {
        isSending: false,
        text: this.initText
      };
    },
    created(){

    },
    methods: {
      clickSend () {
        this.$emit('startsend');
      },
      send () {
        if (this.isSending) {
          return;
        }
        this.isSending = true;
        clearInterval(this.timer);
        this.num = 60;
        this.text = `已发送(${this.num}s)`;
        this.timer = setInterval(() => {
          if (this.num === 0) {
            this.text = `重新发送`;
            this.isSending = false;
            clearInterval(this.timer);
            this.$emit('endsend');
            return false;
          }
          this.num--;
          this.text = `已发送(${this.num}s)`;
        }, 1000);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "send-msg";
</style>

<template>
  <div class="g-scroll-wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';

  export default {
    props: {
      click: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 1
      },
      data: {
        type: Object,
        default: null
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      listenScroll: {
        type: Boolean,
        default: false
      }

    },
    mounted () {
      setTimeout(() => {
        this._initScroll();
      }, 20);
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return;
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        });
        if (this.listenScroll) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      enable () {
        this.scroll && this.scroll.enable();
      },
      disable () {
        this.scroll && this.scroll.disable();
      },
      refresh () {
        if (this.scroll) {
          this.scroll.refresh();
        }
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh();
        }, this.refreshDelay);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  .g-scroll-wrapper{
    height: 100%;
    overflow: hidden;
  }
</style>

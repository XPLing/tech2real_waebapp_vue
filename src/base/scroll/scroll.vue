<template>
  <div class="g-scroll-wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import * as util from 'assets/js/util';

  const DIRECTION_H = 'horizontal';
  const DIRECTION_V = 'vertical';
  const NAV_HEIGHT = util.common.calculateWH(60);
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
        type: [Object, Array],
        default: null
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      pullup: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: DIRECTION_V
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
        var defaultOpts = {
          probeType: this.probeType,
          click: this.click,
          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        };
        if (this.pullup) {
          defaultOpts = Object.assign({}, defaultOpts, {
            pullUpLoad: {
              threshold: 60
            }
          });
        }
        this.scroll = new BScroll(this.$refs.wrapper, defaultOpts);
        if (this.listenScroll) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos);
          });
        }
        if (this.pullup) {
//          this.scroll.on('scrollEnd', () => {
//            console.log(this.scroll.y);
//            console.log(this.scroll.maxScrollY);
//            if (this.scroll.y <= (this.scroll.maxScrollY)) {
//              this.$emit('scrollToEnd');
//            }
//          });
          this.scroll.on('pullingUp', () => {
            this.$emit('pullingUp');
          });
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
      },
      finishPullUp () {
        if (this.scroll) {
          this.scroll.finishPullUp();
        }
      },
      closePullUp () {
        if (this.scroll) {
          this.scroll.closePullUp();
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

  .g-scroll-wrapper {
    height: 100%;
    overflow: hidden;
  }
</style>

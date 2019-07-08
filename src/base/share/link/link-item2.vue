<template>
  <div class="c-share-link">
    <img class="cover" v-lazy="{
          src: drawImg || data.cover,
          error: lazy.error,
          loading: lazy.loading
        }">
    <p class="title">{{data.title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  import { imgOnloadSingle, changeImgRatio } from 'assets/js/imgOnload';
  import { common } from 'assets/js/util';
  // shareType; //1 课程，2 资讯文章，3 活动，10 其他；

  const IMG_W = common.calculateWH(46);
  const IMG_H = common.calculateWH(46);

  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        },
        drawImg: null
      };
    },
    created () {

    },
    mounted(){
      imgOnloadSingle(this.data.cover).then(res => {
        let imgSrc, boxImg;
        boxImg = {
          width: IMG_W,
          height: IMG_H
        };
        imgSrc = changeImgRatio(res, boxImg);
        this.drawImg = imgSrc;
      }).catch(e => {
        console.log(e);
      });
    },
    methods: {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./link-item";
</style>

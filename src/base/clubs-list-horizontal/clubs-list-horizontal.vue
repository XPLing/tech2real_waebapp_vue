<template>
  <div class="g-club-list">
    <swiper :options="swiperOPtsClubs" class="g-swiper">
      <swiper-slide class="swiper-item" v-for="(item,index) in clubList" :key="index" @click.native="selectItem(item)">
        <div class="c-media">
          <div class="avatar">
            <img :src="item.logoUrl">
          </div>
          <div class="desc">
            <p class="title">{{item.name | ellipsis(5)}} </p>
            <p class="btn" @click.stop="operate(item)">{{item.userClubId==1?'已关注':'关注'}}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import { imgOnload } from 'assets/js/imgOnload';
  export default {
    props: {
      clubList: {
        type: Array,
        default: null
      }
    },
    data(){
      return {
        swiperOPtsClubs: {
          freeMode: true,
          loop: false,
          slidesPerView: 3.5,
          spaceBetween: 5
        }
      }
    },
    methods: {
      selectItem (data) {
        this.$emit('selectItem', data);
      },
      operate (data) {
        this.$emit('join', data);
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "clubs-list-horizontal";
</style>

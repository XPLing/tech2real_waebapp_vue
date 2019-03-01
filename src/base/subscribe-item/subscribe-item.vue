<template>
  <div class="c-subscribe-item" @click.stop="selectItem(subscribeData)">
    <div class="data" v-if="subscribeData">
      <div class="media-left">
        <img v-lazy="{
                src: subscribeData.course.coverUrl,
                error: lazy.error,
                loading: lazy.loading
              }" alt="">
        <div class="bg-layer"></div>
        <div class="progress-wrapper">
          <p class="desc">
            学习进度{{percentage}}%</p>
          <div class="progress">
            <div class="bar" :style="`width:${percentage}%`"></div>
          </div>
        </div>
      </div>
      <div class="media-body">
        <p class="name">{{subscribeData.course.title}}</p>
        <p class="info">
            <span class="validity-time org">
              {{subscribeData.courseApplyValidityPeriod.discription}}
            </span>
          <span class="price"
                :class="subscribeData.course.price === 0? 'green': 'red'">{{subscribeData.course.price === 0 ? '免费' : subscribeData.course.price}}</span>
        </p>
      </div>
    </div>
    <div class="operate">
      <button class="btn" @click.stop="details(subscribeData)">购课详情</button>
      <button class="btn">继续学习</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      subscribeData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        }
      };
    },
    computed: {
      percentage () {
        var percentage = 0;
        if (this.subscribeData) {
//          debugger
          if (this.subscribeData.course.courseRecord) {
            if (this.subscribeData.course.courseRecord.isComplete) {
              percentage = 100;
            } else {
              var hadRead = this.subscribeData.course.courseRecord.chapterIds.split(',').length;
              percentage = ((hadRead / Number(this.subscribeData.course.courseRecord.chapterCount)) * 100).toFixed(2);
            }
          }
        }
        return percentage;
      }
    },
    created () {
    },
    methods: {
      selectItem (data) {
        this.$emit('selectItem', data);
      },
      details (data) {
        this.$emit('details', data);
      }
    },
    watch: {
      subscribeData () {
        console.log('data change');
      }
    }

  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "subscribe-item";
</style>

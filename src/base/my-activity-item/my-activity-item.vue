<template>
  <div class="c-subscribe-item" @click.stop="selectItem(data)">
    <p class="apply-time">{{data.applyStartTime | formatDate('yyyy-MM-dd')}}</p>
    <div class="data" v-if="data">
      <div class="media-left">
        <img v-lazy="{
                src: data.coverUrl,
                error: lazy.error,
                loading: lazy.loading
              }" alt="">

      </div>
      <div class="media-body">
        <p class="name">{{data.title}}</p>
        <p class="info">
            <span class="address">时间地点：{{data.city}} {{data.startTime | formatDate('yyyy-MM-dd')}}</span>
        </p>
      </div>
    </div>
    <div class="operate">
      <button class="btn" @click.stop="details(data)">报名详情</button>
      <button class="btn">继续学习</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
        }
      };
    },
    computed: {
      percentage () {
        var percentage = 0;
        if (this.data) {
          if (this.data.courseRecord) {
            if (this.data.courseRecord.isComplete) {
              percentage = 100;
            } else {
              var hadRead = this.data.courseRecord.chapterIds.split(',').length;
              percentage = (hadRead / Number(this.data.courseRecord.chapterCount)) * 100;
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
    }

  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "my-activity-item";
</style>

<template>
  <li class="c-data-list-item" @click.stop="selectItem(data)">
    <p class="cover">
      <img v-lazy="{
          src: data.coverUrl,
          error: lazy.error,
          loading: lazy.loading
        }" alt="">
    </p>
    <div class="detail">
      <p class="title">{{data.title}}</p>
      <p class="info">
        <span class="detail" :class="isEnd?'disable':''">
          <i class="address">{{data.city}}</i>
          <i class="time">{{data.applyEndTime | formatDate('yyyy-MM-dd')}}</i>
          <i class="status">{{ isEnd ? '已结束' : ''}}</i>
        </span>
        <span class="price"
              :class="data.minPrice === 0? 'green': 'red'">{{data.minPrice === 0 ? '免费' : data.minPrice}}</span>
      </p>
    </div>
  </li>
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
        isEnd: new Date().getTime() > this.data.applyEndTime,
        lazy: {
          src: this.data.coverUrl,
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        }
      };
    },
    created () {
    },
    methods: {
      selectItem (data) {
        this.$emit('selectActivity', data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "activity-item";
</style>

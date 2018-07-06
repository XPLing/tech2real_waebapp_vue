<template>
  <li class="c-data-item" @click.stop="selectItem(data)">
    <div class="left">
      <p class="top">
        <span class="price">
          {{data.price===0?'免费':data.price}}
          <i class="unit" v-if="!data.price===0">/张</i>
        </span>
        <span>{{data.name}}</span>
      </p>
      <p class="bottom">{{data.brief}}</p>
    </div>
    <div class="right" @click.stop="goBuy(data)">{{data.remainCount===0?'售罄':'立即购买'}}</div>
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
        isEnd: new Date().getTime() > this.data.applyEndTime
      };
    },
    created () {
    },
    methods: {
      selectItem (data) {
        this.$emit('selectTicket', data);
      },
      goBuy (data) {
        this.$emit('goBuy', data);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "ticket-item";
</style>

<template>
  <div class="c-apply-result-item c-media" @click.stop="selectItem(applyResult)">
    <div class="media-left">
      <img :src="applyResultBase.coverUrl" />
    </div>
    <div class="media-body">
      <p class="title">{{applyResultBase.title}}</p>
      <p class="info"><span class="price"
                            :class="applyResultDetail.price===0?'green':'red'">{{applyResultDetail.price === 0 ? '免费' : `￥${applyResultDetail.price}`}}</span>
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      applyResult: {
        type: Object,
        default: null
      },
      applyResultBase: {
        type: Object,
        default: null
      },
      applyResultDetail: {
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
    created () {
    },
    methods: {
      selectItem (applyResult) {
        this.$emit('selectApplyResultItem', applyResult);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "applyResult-item";
</style>

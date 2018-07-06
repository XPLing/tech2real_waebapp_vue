<template>
  <ul class="g-select-list">
    <li class="item" :class="{'on': index==currentSelect}" v-for="(item, index) in selectData" :key="index"
        @click.stop="selectItem(item,index)">
      {{item.discription}}
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      selectData: {
        type: [Array, Object],
        default: null
      },
      defaultSelect: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        currentSelect: 0
      };
    },
    created () {
      if (this.defaultSelect) {
        this.currentSelect = this.defaultSelect;
      }
      if (this.selectData) {
        this.$emit('selectItem', this.selectData[this.currentSelect], 0);
      }
    },
    methods: {
      selectItem (item, index) {
        this.currentSelect = index;
        this.$emit('selectItem', item, index);
      }
    },
    components: {},
    watch: {
      selectData(){
        this.$emit('selectItem', this.selectData[this.currentSelect], 0);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./select2-list";
</style>

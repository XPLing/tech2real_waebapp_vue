<template>
  <ul class="g-select-list">
    <li class="item" :class="{'on': index==currentSelect}" v-for="(item, index) in selectData" :key="index"
        @click.stop="selectItem(item,index)">
      {{item.title}}
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      selectData: {
        type: [Array, Object],
        default () {
          return [
            {
              'id': 408,
              'settingId': 950,
              'title': '女',
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
            },
            {
              'id': 409,
              'settingId': 950,
              'title': '男',
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
            },
            {
              'id': 408,
              'settingId': 950,
              'title': '女',
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
            },
            {
              'id': 409,
              'settingId': 950,
              'title': '男',
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
            },
            {
              'id': 408,
              'settingId': 950,
              'title': '女',
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
            },
            {
              'id': 409,
              'settingId': 950,
              'title': '男',
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
            }
          ];
        }
      },
      defaultSelect: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        currentSelect: -10
      };
    },
    created () {
      if (this.defaultSelect) {
        this.currentSelect = this.defaultSelect;
      }
    },
    methods: {
      selectItem (item, index) {
        this.currentSelect = index;
        this.$emit('selectItem', item, index);
      }
    },
    components: {}
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./select2-list";
</style>

<template>
  <div class="g-select" v-show="showFlag">
    <div class="mask" @click.stop="clickMask"></div>
    <transition name="drop-down">
      <div class="g-select-box" v-show="showFlag">
        <p class="title">{{title}}</p>
        <slot></slot>
        <div class="g-select-wrapper">
          <scroll :data="{selectData}" ref="scroll">
            <g-select-list @selectItem="selectListItem" :selectData="selectData"></g-select-list>
          </scroll>
        </div>
        <p class="btn" @click="confirm">确定</p>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import GSelectList from 'base/select2-list/select2-list';

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
      currentSelect: {
        type: Number,
        default: -1
      },
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showFlag: false,
        selectInfo: {}
      };
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      confirm(){
        this.$emit('selectConfirm', this.selectInfo);
        this.hide();
      },
      selectListItem (item, index) {
        this.selectInfo.item = item;
        this.selectInfo.index = index;
        this.$emit('selectListItem', item, index);
      },
      clickMask () {
        this.hide();
        this.$emit('clickMask');
      }
    },
    components: {
      Scroll,
      GSelectList
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./select2";
</style>

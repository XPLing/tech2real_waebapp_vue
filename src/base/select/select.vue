<template>
  <div class="g-select" v-show="showFlag">
    <div class="mask" @click.stop="clickMask"></div>
    <transition name="drop-down">
      <div class="g-select-box" v-show="showFlag">
        <scroll :data="{selectData}" ref="scroll">
          <div class="g-select-wrapper">
            <ul class="g-form-select" v-show="showFlag">
              <li class="item" :class="{'on': index==currentSelect}" v-for="(item, index) in selectData" :key="index"
                  @click.stop="selectItem(item,index)">
                {{item.title}}
              </li>
            </ul>
          </div>
        </scroll>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';

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
            }
          ];
        }
      },
      currentSelect: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        showFlag: false
      };
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      selectItem (item, index) {
        this.$emit('select', item, index);
        this.hide();
      },
      clickMask(){
        this.hide();
        this.$emit('clickMask');
      }
    },
    components: {
      Scroll
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./select";
</style>

<template>
  <ul class="g-train-detail-tab">
    <li class="tab-item" @click="changeTab(item)" :class="{'active': currentIndex===item.id}" v-if="item.id!==1 || ( item.id==1 && chapterData && chapterData.length>0)"
        v-for="(item,index) in list" :key="index">
      <span class="tab-link">{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  import { routerPrefix } from 'assets/js/util';

  export default {
    props: ['appliedState', 'chapterData'],
    data () {
      return {
        courseID: 0,
        routerPrefix,
        currentIndex: 0,
        list: [
          {
            name: '课程',
            id: 0
          },
          {
            name: '章节',
            id: 1
          },
          {
            name: '评价',
            id: 2
          }
        ]
      };
    },
    created () {
      this.courseID = this.$route.params.id;
//      if (this.appliedState !== 0) {
//        this.list.push({
//          name: '评价',
//          id: 2
//        });
//      }
    },
    methods: {
      changeTab (data) {
        this.currentIndex = data.id;
        this.$emit('changeTab', data);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./train-detail-tab";

</style>

<template>
  <ul class="g-train-detail-tab">
    <!--<router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/intro'}" replace>-->
    <!--<span class="tab-link">课程</span>-->
    <!--</router-link>-->
    <!--<router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/chapters'}" replace>-->
    <!--<span class="tab-link">章节</span>-->
    <!--</router-link>-->
    <!--<router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/evaluate'}" replace>-->
    <!--<span class="tab-link">评价</span>-->
    <!--</router-link>-->
    <!--<router-link tag="li" class="tab-item" :to="{path: routerPrefix + '/train/'+ courseID +'/community'}" replace>-->
    <!--<span class="tab-link">交流</span>-->
    <!--</router-link>-->
    <li class="tab-item" @click="changeTab(item)" :class="{'active': currentIndex===item.id}"
        v-for="(item,index) in list" :key="index">
      <span class="tab-link">{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  import { routerPrefix } from 'assets/js/util';

  export default {
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
          },
          {
            name: '交流',
            id: 3
          }
        ]
      };
    },
    created () {
      this.courseID = this.$route.params.id;
    },
    methods: {
      changeTab(data){
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

<template>
  <ul class="c-activity-list">
    <activity-item :data="item" v-for="(item, index) in activityList" :key="index"
                    @selectActivity="selectActivity"></activity-item>
  </ul>
</template>

<script type="text/ecmascript-6">
  import ActivityItem from 'base/activity-item/activity-item';

  export default {
    props: {
      activityList: {
        type: Array,
        default: null
      }
    },
    data () {
      return { };
    },
    created () {
    },
    methods: {
      selectActivity (activityItem) {
        this.$emit('selectActivity', activityItem);
      }
    },
    components: {
      ActivityItem
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./activity-list";
</style>

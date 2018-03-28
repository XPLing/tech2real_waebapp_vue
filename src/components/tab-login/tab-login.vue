<template>
  <div class="g-tab-login">
    <div class="tag">
        <router-link v-for="(item,index) in tabList" :key="index" class="item" :to="item.path" replace>
            <p>{{item.name}}</p>
            <i class="icon fa fa-caret-up"></i>
        </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      hasBack: {
        type: Boolean,
        default: false
      },
      hasSearch: {
        type: Boolean,
        default: false
      },
      tabList: {
        type: Array,
        default(){
          return []
        }
      }
    },
    data () {
      return {}
    },
    methods: {
      back(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./tab-login";

</style>

<template>
  <div class="g-header-title">
    <i v-if="hasBack" class="fa fa-angle-left left" @click="back" aria-hidden="true"></i>
    <span class="title">{{title}}</span>
    <i v-if="hasSearch" class="fa c-icon-search right" aria-hidden="true"></i>
    <i v-if="hasShare" class="fa c-icon-share_top right" aria-hidden="true" @click="share"></i>
    <i v-if="hasOperate" class="operate right" @click="operateHandle">{{operateStr}}</i>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      operateStr: {
        type: String,
        default: ''
      },
      backHandle: {
        type: String,
        default: 'default'
      },
      hasBack: {
        type: Boolean,
        default: false
      },
      hasShare: {
        type: Boolean,
        default: false
      },
      hasOperate: {
        type: Boolean,
        default: false
      },
      hasSearch: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {};
    },
    computed: {
      ...mapGetters([
        'firstBack',
        'routerHistory'
      ])
    },
    methods: {
      back () {
        if (this.backHandle === 'default') {
          console.log(this.$route);
          var hsitory = this.routerHistory[0], isRoot = /root/.test(hsitory.name), path = this.$route.matched[0].path,
            isSubRoute = this.$route.meta.isFirst == 1 && hsitory.fullPath === this.$route.fullPath;
          if (window.history.length === 1 || isSubRoute) {
            if (isSubRoute) {
              this.$route.meta.isFirst = 0;
              this.updateFirstBack(false);
            }
            this.$router.replace({
              path: path
            });
          } else {
            this.$router.back();
          }
        }
        this.$emit('back');
      },
      operateHandle () {
        this.$emit('operate');
      },
      share () {
        this.$emit('share');
      },
      ...mapMutations({
        updateFirstBack: 'UPDATE_FIRSTBACK'
      })
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./header-title";

</style>

<template>
  <transition name="slide">
    <div class="g-feedback">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true" :has-operate="true" :operate-str="'发送'"
                     @operate="send"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
          <textarea class="feedback-cont" name="feedback" rows="100" v-model="feedbackCont"
                    placeholder="您的意见..."></textarea>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { addFeedback } from 'api/feedback';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';

  export default {
    data () {
      return {
        toptipTxt: '',
        pageTitle: '意见反馈',
        feedbackCont: ''
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid',
        'userInfo'
      ])
    },
    created () {

    },
    mounted () {
    },
    methods: {
      send () {
        if (!this.feedbackCont.trim() || !this.userGuid || !this.userInfo || !this.userInfo.mobile) {
          return false;
        }
        this._addFeedback().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.$router.back();
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      _addFeedback () {
        var param = {
          product_guid: this.productGuid,
          user_guid: this.userGuid,
          user_mobile: this.userInfo.mobile,
          content: this.feedbackCont
        };
        return addFeedback(param);
      }
    },
    watch: {
      courseIntro () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      courseList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      HeaderTitle,
      TopTip,
      Scroll
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./feedback";

</style>

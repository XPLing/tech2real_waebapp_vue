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
                    placeholder="您的意见..." @blur="inputBlur($event)"></textarea>
          </div>
        </scroll>
      </div>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
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
  import Confirm from 'base/confirm/confirm';

  export default {
    data () {
      return {
        confirmTxt: '请先登录!',
        toptipTxt: '',
        pageTitle: '意见反馈',
        feedbackCont: '',
        sendFlag: true,
        scrollTop: 5
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid',
        'userInfo',
        'systemInfo'
      ])
    },
    created () {
      this.sendResult = false;
    },
    mounted () {
    },
    methods: {
      inputBlur (event) {
        if (this.systemInfo.type() !== 1.2) {
          return;
        }
        if (this.blurTimer) {
          clearTimeout(this.blurTimer);
        }
        this.blurTimer = setTimeout(() => {
          var activeElement = document.activeElement;
          var isEqual = activeElement.isEqualNode(event.target),
            isInput = /input|textarea/.test(activeElement.tagName.toLocaleLowerCase());
          if (!isEqual && !isInput) {
            document.body.scrollTop += ++this.scrollTop;
          }
        }, 300);
      },
      confirm () {
        if (!this.userGuid) {
          this.$router.replace({
            path: '/user/login'
          });
        } else if (this.sendResult) {
          this.$router.back();
        }
      },
      cancel () {
        if (this.sendResult) {
          this.$router.back();
        }
      },
      send () {
        this.sendResult = false;
        if (!this.sendFlag || !this.feedbackCont.trim() || !this.userGuid || !this.userInfo || !this.userInfo.mobile) {
          if (!this.userGuid) {
            this.$refs.confirmsWrapper.show();
          }
          return false;
        }
        this.sendFlag = false;
        this._addFeedback().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.sendResult = true;
            this.confirmTxt = '发布成功!';
            this.$refs.confirmsWrapper.show();
          }
        }).catch(error => {
          this.toptipTxt = error.message;
          this.$refs.toptip.show();
        }).finally(() => {
          this.sendFlag = true;
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
      Scroll,
      Confirm
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./feedback";

</style>

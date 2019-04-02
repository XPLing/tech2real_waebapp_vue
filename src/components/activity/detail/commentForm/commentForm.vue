<template>
  <transition name="slide">
    <div class="g-commentForm">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true" :has-operate="true" :operate-str="'发送'"
                     @operate="send"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
          <textarea class="commentForm-cont" name="commentForm" rows="100" v-model="commentFormCont"
                    :placeholder="commentFormPlaceholder"></textarea>
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
  import { addCommentV2, addCommentReply } from 'api/info';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Confirm from 'base/confirm/confirm';

  export default {
    name: 'NKA_activityCommentForm',
    props: ['commentFormPlaceholder', 'type'],
    data () {
      return {
        confirmTxt: '请先登录!',
        toptipTxt: '',
        pageTitle: '评论',
        commentFormCont: '',
        sendFlag: true
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
      this.sendFlag = false;
    },
    mounted () {
    },
    methods: {
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
        this.sendFlag = false;
        if (!this.sendFlag || !this.commentFormCont.trim() || !this.userGuid || !this.userInfo || !this.userInfo.mobile) {
          if (!this.userGuid) {
            this.$refs.confirmsWrapper.show();
          }
          return false;
        }
        this.sendFlag = false;
        var fnName = '';
        if (this.type === 'comment') {
          fnName = '_addCommentV2';
        } else {
          fnName = '_addCommentReply';
        }
        this[fnName]().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            if (this.type === 'comment') {
              this.$emit('commentUpdate');
            } else {
              this.$emit('replyUpdate');
            }

            this.sendResult = true;
            this.confirmTxt = '发布成功!';
            this.$refs.confirmsWrapper.show();
          }
        }).catch(erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        }).finally(() => {
          this.sendFlag = true;
        });
      },
      _addCommentV2 () {
        var param = {
          targetId: this.$route.params.id,
          userGuid: this.userGuid,
          content: this.commentFormCont,
          type: 3
        };
        return addCommentV2(param);
      },
      _addCommentReply () {
        var param = {
          commentId: this.$route.params.commentId,
          userGuid: this.userGuid,
          content: this.commentFormCont
        };
        if (this.$route.query.replyId) {
          param = Object.assign({}, param, {
            replyId: this.$route.query.replyId,
            replyUserGuid: this.$route.query.replyUserGuid
          });
        }
        return addCommentReply(param);
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
  @import "./commentForm";

</style>

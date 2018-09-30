<template>
  <transition name="slide">
    <div class="g-apply-result">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="g-main-wrapper" v-if="applyInfo">
        <scroll :data="applyInfo" ref="scroll">
          <div class="g-scroll-continer">
            <div class="apply-base">
              <p class="header-bg"></p>
              <div class="status">
                支付结果确认
              </div>
              <div class="intro" v-if="applyInfo">
                <apply-item :apply-result-base="this.payTargetType === 'course'?applyInfo.course:applyInfo.activity" :apply-result-detail="this.payTargetType === 'course'?applyInfo.course:applyInfo.ticket"
                            :apply-result="applyInfo"
                            @selectApplyResultItem="selectApplyTarget"></apply-item>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading" :title="loadingTxt"></loading>
      <confirm ref="payConfirmsWrapper" :text="payConfirmTxt" :confirm-btn-text="'已完成支付'"
               :cancel-btn-text="'支付遇到问题,重新支付'" :layout-type="'vertical'"
               @cancel="payCancel" @confirm="payConfirm"></confirm>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import ApplyItem from 'base/applyResult-item/applyResult-item';
  import Scroll from 'base/scroll/scroll';
  import * as util from 'assets/js/util';
  import * as filters from 'assets/js/filters';
  import { getCourseApplyByCourseId } from 'api/courseDetail';
  import { getApplyByActivityId } from 'api/activity';
  import { getOrderSuc } from 'api/pay';
  import { ERR_OK } from 'api/config';
  import Loading from 'base/loading/loading';
  import TopTip from 'base/top-tip/top-tip';
  import { mapGetters, mapMutations } from 'vuex';
  import Confirm from 'base/confirm/confirm';

  var APPLYSTATE = ['报名成功', '报名取消', '待支付', '待审核', '报名失败'];

  export default {
    beforeRouteLeave (to, from, next) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      next();
    },
    props: {
      applyResult: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageTitle: '支付确认',
        hasBack: false,
        routerPrefix: util.routerPrefix,
        applyInfo: null,
        applyState: '',
        toptipTxt: '',
        order: null,
        timer: null,
        remainTime: '',
        payConfirmTxt: '请确认支付是否已完成',
        confirmTxt: '',
        confirmDialog: true,
        loadingTxt: '正在加载中...'
      };
    },
    created () {
      this.applyTargetID = this.$route.query.id;
      this.applyID = this.$route.query.applyId;
      this.payType = this.$route.query.payType;
      this.payTargetType = this.$route.query.payTargetType;
      this.getApplyInfo();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    mounted () {
      this.$refs.payConfirmsWrapper.show();
    },
    methods: {
      payCancel () {
        this.validatePayResule();
      },
      payConfirm () {
        this.validatePayResule();
      },
      validatePayResule () {
        return this._getOrderSuc().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.loadingTxt = '支付失败，请重新报名支付！';
            } else {
              this.loadingTxt = '支付成功，正在跳转...！';
            }
            this.$refs.loading.show();
            setTimeout(() => {
              this.$router.replace({
                path: `/train/all/${this.applyInfo.course.id}`
              });
            }, 5000);
          } else {
            return Promise.reject(res);
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      getApplyInfo () {
        var fnName = '';
        if (this.payTargetType === 'course') {
          fnName = '_getCourseApplyByCourseId';
        } else {
          fnName = '_getApplyByActivityId';
        }
        return this[fnName]().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.applyInfo = res.result;
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      selectApplyTarget (courseID) {
        this.$router.replace({
          path: `/train/all/${this.applyInfo.course.id}`
        });
      },
      _getCourseApplyByCourseId (infoCollections) {
        let params = {
          id: this.applyTargetID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return getCourseApplyByCourseId(params);
      },
      _getApplyByActivityId (infoCollections) {
        let params = {
          id: this.applyTargetID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return getApplyByActivityId(params);
      },
      _getOrderSuc (infoCollections) {
        let params = {
          id: this.applyInfo.order.id
        };
        return getOrderSuc(params);
      }
    },
    components: {
      HeaderTitle,
      ApplyItem,
      Scroll,
      Loading,
      TopTip,
      Confirm
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "payResult";
</style>

<template>
  <transition name="slide">
    <div class="g-course-pay">
      <scroll :data="applyInfo" ref="scroll">
        <div class="g-scroll-continer">
          <header class="g-header">
            <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
          </header>
          <div class="chunk info-wrapper">
            <!--<h1 class="title">课程信息</h1>-->
            <div class="info">
              <apply-item :apply-result-base="applyInfo.course" :apply-result-detail="applyInfo.course"
                          :apply-result="applyInfo"
                          @selectApplyResultItem="selectApplyTarget"></apply-item>
            </div>
          </div>
        </div>
        <form class="c-form" data-vv-scope="pay">
          <div class="chunk pay-wrapper">
            <h1 class="title">支付方式</h1>
            <div class="c-form-group">
              <div class="input-item">
                <input class="float-input" v-model="payWay" type="radio" name="payWay" id="wepay" value="wepay"
                       v-validate="'required|in:wepay,alipay'">
                <label class="label" for="wepay">
                  <div class="title-wrapper">
                    <i class="icon c-icon-wepay"></i>
                    <div class="desc">
                      <p class="name">微信支付</p>
                      <p class=tip-info>推荐安装有微信5.0及以上版本的用户使用</p>
                    </div>
                  </div>
                  <p class="btn">
                    <i class="icon " :class="payWay==='wepay'?['c-icon-check-circle','active']:'c-icon-circle-o'"></i>
                  </p>
                </label>
              </div>
              <div class="input-item">
                <input class="float-input" type="radio" v-model="payWay" name="payWay" id="alipay" value="alipay">
                <label class="label" for="alipay">
                  <div class="title-wrapper">
                    <i class="icon c-icon-alipay"></i>
                    <div class="desc">
                      <p class="name">支付宝支付</p>
                      <p class=tip-info>推荐有支付宝账号的用户使用</p>
                    </div>
                  </div>
                  <p class="btn">
                    <i class="icon" :class="payWay==='alipay'?['c-icon-check-circle','active']:'c-icon-circle-o'"></i>
                  </p>
                </label>
              </div>
              <div v-show="errors.has('pay.payWay')" class="c-msg">
                <i class="icon fa fa-exclamation-circle text-danger"></i>
                <span class="meg text-danger">{{ errors.first('pay.payWay')}}</span>
              </div>
            </div>

          </div>
          <div class="chunk protocol">
            <div class="c-form-group">
              <div class="input-item">
                <input class="float-input" type="checkbox" v-model="protocol" name="protocol" id="protocol"
                       value="protocol" v-validate="'required'">

                <label class="label" for="protocol">
                  <div class="c-media">
                    <div class="avatar">
                      <i class="icon"
                         :class="protocol?['c-icon-check-circle','active']:'c-icon-circle-o'"></i>
                    </div>
                    <div class="desc">
                      我已确认课程日期或课程时间！课程一经支付成功，恕不办理退款。票据仅提供普通增值税发票
                    </div>
                  </div>
                </label>
              </div>
              <div v-show="errors.has('pay.protocol')" class="c-msg">
                <i class="icon fa fa-exclamation-circle text-danger"></i>
                <span class="meg text-danger">{{ errors.first('pay.protocol')}}</span>
              </div>
            </div>
          </div>
        </form>
        <form-tip-error :tip-name="'pay.totalMsg'"></form-tip-error>
      </scroll>
      <bottom-btn :price="0" :btnstr="'立即支付'" @confirm="toPay"></bottom-btn>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
    </div>

  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import ApplyItem from 'base/applyResult-item/applyResult-item';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Scroll from 'base/scroll/scroll';
  import BottomBtn from 'base/bottom-btn/bottom-btn';
  import * as util from 'assets/js/util';
  import { Validator, ErrorBag } from 'vee-validate';
  import { getApplyByActivityId } from 'api/activity';
  import { mapGetters } from 'vuex';
  import { ERR_OK } from 'api/config';
  import Loading from 'base/loading/loading';
  import TopTip from 'base/top-tip/top-tip';
  export default {
    props: {
      applyResult: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageTitle: '购买课程',
        hasBack: true,
        applyInfo: this.applyResult,
        routerPrefix: util.routerPrefix,
        fornName: 'pay',
        payWay: '',
        protocol: true,
        toptipTxt: ''
      };
    },
    created () {
      this.applyTargetID = this.$route.params.id;
      this.errors.update({
        field: 'payWay',
        msg: 'Newsletter Email is required',
        rule: 'required',
        scope: 'pay'
      });
      this.$validator.localize({
        zh_CN: {
          attributes: {
            payWay: '支付方式',
            protocol: '支付须知'
          }
//          custom: {
//            payWay: {
//              required: field => '请勾选' + field
//            }
//          }
        }
      });

    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {

          }
        }, (erro) => {
          console.log('Form erro!');
        });
      },
      selectApplyTarget (data) {
        this.$router.back();
      },
      toPay () {
        this.validateForm(this.fornName);
      },
      _getApplyByActivityId () {
        let params = {
          id: this.applyTargetID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return getApplyByActivityId(params);
      }
    },
    components: {
      HeaderTitle,
      ApplyItem,
      Scroll,
      FormTipError,
      BottomBtn,
      Loading,
      TopTip
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "~assets/scss/propertype";
  @import "./courseApplyPay";
</style>

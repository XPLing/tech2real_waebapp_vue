<template>
  <transition name="slide">
    <div class="g-course-pay">
      <scroll :data="applyResult" ref="scroll">
        <div class="g-scroll-continer">
          <header class="g-header">
            <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
          </header>
          <div class="chunk info-wrapper">
            <h1 class="title">课程信息</h1>
            <div class="info">
              <course-list :course-list="courseList" v-if="courseList.length>0"
                           @selectcourse="selectCourse"></course-list>
            </div>
          </div>
        </div>
        <div class="chunk pay-wrapper">
          <h1 class="title">支付方式</h1>
          <form class="c-form" data-vv-scope="pay">
            <div class="c-form-group">
              <div class="input-item">
                <input class="float-input" type="radio" name="payWay" id="wePay" value="wepay" v-validate="'required|in:wepay,alipay'">
                <label class="label" for="wePay">
                  <div class="title-wrapper">
                    <i class="icon c-icon-wepay"></i>
                    <div class="desc">
                      <p class="name">微信支付</p>
                      <p class=tip-info>推荐安装有微信5.0及以上版本的用户使用</p>
                    </div>
                  </div>
                  <p class="btn">
                    <i class="icon c-icon-circle-o"></i>
                  </p>
                </label>
              </div>
              <div class="input-item">
                <input class="float-input" type="radio" name="payWay" id="aliPay" value="alipay">
                <label class="label" for="aliPay">
                  <div class="title-wrapper">
                    <i class="icon c-icon-alipay"></i>
                    <div class="desc">
                      <p class="name">支付宝支付</p>
                      <p class=tip-info>推荐有支付宝账号的用户使用</p>
                    </div>
                  </div>
                  <p class="btn">
                    <i class="icon c-icon-circle-o"></i>
                  </p>
                </label>
              </div>
              <div v-show="errors.has('pay.payWay')" class="c-msg">
                <i class="icon fa fa-exclamation-circle text-danger"></i>
                <span class="meg text-danger">{{ errors.first('pay.payWay')}}</span>
              </div>
            </div>

          </form>
        </div>
        <form-tip-error :tip-name="'pay.totalMsg'"></form-tip-error>
      </scroll>
      <bottom-btn :price="0" :btnstr="'立即支付'" @confirm="toPay"></bottom-btn>
    </div>

  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import CourseList from 'base/course-list/course-list';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Scroll from 'base/scroll/scroll';
  import BottomBtn from 'base/bottom-btn/bottom-btn';
  import * as util from 'assets/js/util';
  import { Validator, ErrorBag } from 'vee-validate';
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
        routerPrefix: util.routerPrefix,
        fornName: 'pay'
      };
    },
    computed: {
      courseList () {
        var list = [];
        if (this.applyResult) {
          list.push(this.applyResult.course);
        }
        return list;
      }
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
      selectCourse (courseID) {
        this.$router.back();
      },
      toPay(){
        this.validateForm(this.fornName);
      }
    },
    components: {
      HeaderTitle,
      CourseList,
      Scroll,
      FormTipError,
      BottomBtn
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "courseApplyPay";
</style>

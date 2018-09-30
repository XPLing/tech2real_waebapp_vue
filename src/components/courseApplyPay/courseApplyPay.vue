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
            <div class="info" v-if="applyInfo">
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
                <input class="float-input" v-model="payWay" type="radio" name="payWay" id="wepay"
                       value="wepay"
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
                    <i class="icon "
                       :class="payWay==='wepay'?['c-icon-check-circle','active']:'c-icon-circle-o'"></i>
                  </p>
                </label>
              </div>
              <div class="input-item">
                <input class="float-input" type="radio" v-model="payWay" name="payWay" id="alipay"
                       value="alipay">
                <label class="label" for="alipay">
                  <div class="title-wrapper">
                    <i class="icon c-icon-alipay"></i>
                    <div class="desc">
                      <p class="name">支付宝支付</p>
                      <p class=tip-info>推荐有支付宝账号的用户使用</p>
                    </div>
                  </div>
                  <p class="btn">
                    <i class="icon"
                       :class="payWay==='alipay'?['c-icon-check-circle','active']:'c-icon-circle-o'"></i>
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
                <input class="float-input" type="checkbox" v-model="protocol" name="protocol"
                       id="protocol"
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
      <bottom-btn v-if="applyInfo" :price="applyInfo.course.price" :btnstr="'立即支付'" @confirm="toPay"></bottom-btn>
      <top-tip ref="toptip" :delay="10000" :is-auto-hide="topTipAutoHide">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <confirm ref="payConfirmsWrapper" :text="payConfirmTxt" :confirm-btn-text="'已完成支付'"
               :cancel-btn-text="'支付遇到问题,重新支付'"
               @cancel="payCancel" @confirm="payConfirm"></confirm>
      <confirm ref="confirmsWrapper" :is-dialog="confirmDialog" :text="confirmTxt" @confirm="confirm"
               @cancel="cancel"></confirm>
      <loading ref="loading" :title="loadingTxt"></loading>
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
  import { getCourseApplyByCourseId } from 'api/courseDetail';
  import { getWxJsApiConfig, wechatPay, wxPayH5, generateAlipayPaymentInfoV2, alipay, getAlipayConfig } from 'api/pay';
  import { mapGetters, mapMutations } from 'vuex';
  import { thirdParty, ERR_OK } from 'api/config';
  import Loading from 'base/loading/loading';
  import TopTip from 'base/top-tip/top-tip';
  import Confirm from 'base/confirm/confirm';
  import wx from 'weixin-js-sdk';
  import { webLoginByThirdPartCode } from 'api/login';
  import mutations from '../../store/mutations';

  export default {
    name: 'NKA_trainDetailApplyPay',
    data () {
      return {
        pageTitle: '购买课程',
        hasBack: true,
        applyInfo: null,
        routerPrefix: util.routerPrefix,
        fornName: 'pay',
        payWay: '',
        protocol: true,
        toptipTxt: '',
        loadingTxt: '',
        payConfirmTxt: '请确认支付是否已完成',
        confirmTxt: '',
        confirmDialog: true,
        topTipAutoHide: false
      };
    },
    created () {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        this.applyTargetID = this.$route.query.applyTargetId;
        this.applyID = this.$route.query.applyId;
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
        this._getCourseApplyByCourseId().then((res) => {
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
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
    },
    mounted () {
      this._getWxJsApiConfig().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            Promise.reject(res);
            return;
          }
          this.wxInit(res);
        }
      }).catch(e => {
        this.toptipTxt = e.message;
        this.$refs.toptip.show();
      }).finally(() => {
        this.$refs.loading.hide();
      });
      this._webLoginByThirdPartCode().then((res) => {
        if (res.code == ERR_OK || res.code == 201) {
          var thirdPartyInfo = res.result, wxOpenid = thirdPartyInfo.wxOpenid;
          if (res.code == 201) {
            wxOpenid = thirdPartyInfo.wxOpenid;
          }
          var userInfo = Object.assign({}, this.userInfo, {
            wxOpenid: wxOpenid
          });
          this.recordUserinfo(userInfo);
        } else if (res.code === -1) {
          return false;
        } else {
          return Promise.reject(res);
        }
      }).catch(error => {
        this.topTipAutoHide = true;
        this.toptipTxt = error.message;
        this.$refs.toptip.show();
      }).finally(() => {
        this.$refs.loading.hide();
      });
    },
    activated () {

    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid',
        'userInfo',
        'thirdPartyInfo'
      ])
    },
    methods: {
      alipay () {
        this._getAlipayConfig().then((res) => {
          if (res.code == ERR_OK) {
            var data = res.result;
            this._alipay(data);
          } else {
            return Promise.reject(res);
          }
        }).catch((e) => {
          this.topTipAutoHide = true;
          this.toptipTxt = e.message;
          this.$refs.toptip.show();
        }).finally(() => {
          this.$refs.loading.hide();
        });
      },
      wxPayH5 (data) {
        var url = data.mweb_url,
          redirectUri = encodeURIComponent(`${util.config.payRedirectUri}?id=${this.applyTargetID}&applyId=${this.applyID}&payType=weixin&payTargetType=course`);
        url = url + '&redirect_url=' + redirectUri;
        window.location.href = url;
      },
      wxPayJsApi (params) {
        /* eslint-disable no-undef */
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', () => {
              this.onBridgeReady(params);
            }, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', () => {
              this.onBridgeReady(params);
            });
            document.attachEvent('onWeixinJSBridgeReady', () => {
              this.onBridgeReady(params);
            });
          }
        } else {
          this.onBridgeReady(params);
        }
      },
      onBridgeReady (data) {
        /* eslint-disable no-undef */
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': data.appId, // 公众号名称，由商户传入
            'timeStamp': data.timeStamp, // 时间戳，自1970年以来的秒数
            'nonceStr': data.nonceStr, //  随机串
            'package': data.package,
            'signType': data.signType, // 微信签名方式：
            'paySign': data.paySign //  微信签名
          },
          (res) => {
            var meg = '', payResult = '';
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              meg = '支付成功！';
              payResult = 'success';
            } else {
              meg = '支付失败或者支付过程中用户取消！';
              payResult = 'fail';
            }
            this.confirmDialog = true;
            this.confirmTxt = meg;
            this.payResult = payResult;
            this.$refs.confirmsWrapper.show();
          });
      },
      wxInit (data) {
        wx.config({
          //  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.result.appId, // 必填，公众号的唯一标识
          timestamp: data.result.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
          signature: data.result.signature, // 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseWXPay'] // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          // alert('ready');
          //  alert(imgUrl);
          wx.onMenuShareTimeline({//  分享到朋友圈
            title: '', // 分享标题
            desc: '', // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: '' // 分享图标
          });
          wx.onMenuShareAppMessage({//  分享给朋友
            title: '', // 分享标题
            desc: '', // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: '', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            trigger: function (res) {
              //  alert("分享给朋友");
            },
            success: function () {
              // 用户确认分享后执行的回调函数
              //  alert("分享给朋友OK");
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
              // alert("分享给朋友cancel");
            }
          });
          wx.onMenuShareQQ({//  分享到QQ
            title: '', // 分享标题
            desc: '', // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: '' // 分享图标
          });
          wx.onMenuShareWeibo({// 分享到腾讯微博
            title: '', // 分享标题
            desc: '', // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: '' // 分享图标
          });
          wx.onMenuShareQZone({// 分享到QQ空间
            title: '', // 分享标题
            desc: '', // 分享描述
            link: window.location.href, // 分享链接
            imgUrl: '' // 分享图标
          });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

        });
        wx.error((res) => {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          console.log(res);
          this.topTipAutoHide = true;
          this.toptipTxt = res.errMsg;
          this.$refs.toptip.show();
        });
      },
      cancel () {
      },
      confirm () {
        if (this.toPaying) {
          this.toPaying = false;
          this.$router.replace({
            path: `/train/all/${this.applyInfo.course.id}`
          });
        }
      },
      payCancel () {
      },
      payConfirm () {
      },
      authorization (type) {
        var url = '', uri = '', href = '';
        var uriKey = 'uri', appIdKey = 'appId', currentUrl = window.location.href;
        if (/open.dev./.test(currentUrl)) {
          uriKey = 'devUri';
          appIdKey = 'devAppId';
        }
        switch (type) {
          case 'weixin':
            url = thirdParty.wechat.url;
            uri = encodeURIComponent(window.location.href + '&thridparty=weixin');
            var browserType = util.common.getbrowserType();
            var isWechat = browserType === 1.1 || browserType === 1.2;
            if (isWechat) {
              url = thirdParty.wechat.webUrl;
            }
            href = url + '?appid=' + thirdParty.wechat[appIdKey] + '&redirect_uri=' + uri + '&response_type=code&scope=snsapi_userinfo&state=' + util.uuid(8, 16) + '#wechat_redirect';
            break;
        }
        window.location.href = href;
      },
      validateForm (scope) {
        this.$validator.validateAll(scope).then((res) => {
          if (res) {
            this.loadingTxt = '前往支付中...';
            this.$refs.loading.show();
            this.toPaying = true;
            var browserType = util.common.getbrowserType();
            if (this.payWay === 'wepay') {
              var isWechat = browserType === 1.1 || browserType === 1.2;
              var isWap = util.browser.versions.mobile, openid = '';
              if (isWap) {
                if (isWechat) {
                  if (this.userInfo.wxOpenid) {
                    this._wechatPayConfig().then((res) => {
                      if (res.code == ERR_OK) {
                        var data = res.result;
                        this.wxPayJsApi(data);
                      } else {
                        return Promise.reject(res);
                      }
                    }).catch((e) => {
                      this.topTipAutoHide = true;
                      this.toptipTxt = e.message;
                      this.$refs.toptip.show();
                    }).finally(() => {
                      this.$refs.loading.hide();
                    });
                  } else {
                    // 微信授权
                    this.authorization('weixin');
                  }
                } else {
                  this._wechatH5PayConfig().then((res) => {
                    if (res.code == ERR_OK) {
                      var data = res.result;
                      this.wxPayH5(data);
                    } else {
                      return Promise.reject(res);
                    }
                  }).catch((e) => {
                    this.topTipAutoHide = true;
                    this.toptipTxt = e.message;
                    this.$refs.toptip.show();
                  }).finally(() => {
                    this.$refs.loading.hide();
                  });
                }
              } else {
                this.$refs.loading.hide();
                this.toPaying = false;
                this.confirmDialog = true;
                this.confirmTxt = '请在微信打开进行支付!';
                this.$refs.confirmsWrapper.show();
              }
            } else {
              this.alipay();
            }
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
      ...mapMutations({
        recordUserinfo: 'RECORD_USERINFO'
      }),
      _webLoginByThirdPartCode () {
        var url = decodeURIComponent(window.location.search);
        if (!url) {
          return Promise.resolve({code: -1, msg: '无需再次授权'});
        }
        this.loadingTxt = '获取微信网页授权...';
        this.$refs.loading.show();
        url = url.split('?')[1];
        var thirdparty = util.getUrlParameter('thridparty', url, '&');
        var code = util.getUrlParameter('code', url, '&');

        if (!code) {
          return Promise.resolve({code: -1, msg: '无需再次授权'});
        }

        var param = {};
        param.productGuid = this.productGuid;
        param.thirdParty = thirdparty;
        param.code = code;
        return webLoginByThirdPartCode(param);
      },
      _getCourseApplyByCourseId () {
        let params = {
          courseApplyId: this.applyID,
          id: this.applyTargetID,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return getCourseApplyByCourseId(params);
      },
      _getWxJsApiConfig () {
        this.loadingTxt = '环境初始化中...';
        this.$refs.loading.show();
        let params = {
          url: window.location.href
        };
        return getWxJsApiConfig(params);
      },
      _wechatPayConfig () {
        let params = {
          productGuid: this.productGuid,
          user_guid: this.userGuid,
          openid: this.userInfo.wxOpenid,
          appid: thirdParty.wechat.appId,
          id: this.applyInfo.order.id
        };
        return wechatPay(params);
      },
      _wechatH5PayConfig () {
        let params = {
          productGuid: this.productGuid,
          user_guid: this.userGuid,
          appid: thirdParty.wechat.appId,
          id: this.applyInfo.order.id
        };
        return wxPayH5(params);
      },
      _alipay (params) {
        return alipay(params);
      },
      _getAlipayConfig () {
        var browserType = util.browser.versions;
        var url = `${util.config.payRedirectUri}?id=${this.applyTargetID}&applyId=${this.applyID}&payType=alipay&payTargetType=course`;
        let params = {
          id: this.applyInfo.order.id,
          appPay: browserType.mobile ? 'Y' : 'N',
          returnUrl: url,
          shouUrl: url
        };
        return getAlipayConfig(params);
      }
    },
    components: {
      HeaderTitle,
      ApplyItem,
      Scroll,
      FormTipError,
      BottomBtn,
      Loading,
      TopTip,
      Confirm
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "~assets/scss/propertype";
  @import "./courseApplyPay";
</style>

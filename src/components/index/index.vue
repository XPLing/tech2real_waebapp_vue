<template>
  <div id="app" class="g-app-wrapper" @touchmove.prevent>
    <keep-alive :include="keepAliveList">
      <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
    <nav class="g-nav">
      <g-tab></g-tab>
    </nav>
    <top-tip ref="toptip" :delay="10000" :is-auto-hide="topTipAutoHide">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
  </div>
</template>

<script>
  import Tab from 'components/tab/tab';
  import { mapMutations } from 'vuex';
  import * as util from 'assets/js/util';
  import { getWxJsApiConfig } from 'api/pay';
  import { thirdParty, ERR_OK } from 'api/config';
  import wx from 'weixin-js-sdk';
  import TopTip from 'base/top-tip/top-tip';

  export default {
    name: 'App',
    provide () {
      return {
        rootReload: this.reload
      };
    },
    data () {
      return {
        keepAliveList: /^KA_root/,
        isRouterAlive: true,
        toptipTxt: '',
        topTipAutoHide: true
      };
    },
    created () {
      this.recordSystemInfo();
    },
    mounted () {
//      this._getWxJsApiConfig().then((res) => {
//        if (res.code) {
//          if (res.code != ERR_OK) {
//            Promise.reject(res);
//            return;
//          }
//          this.wxInit(res);
//        }
//      }).catch(e => {
//        this.toptipTxt = e.message;
//        this.$refs.toptip.show();
//      }).finally(() => {
//        this.$refs.loading.hide();
//      });
    },
    methods: {
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        });
      },
      wxInit (data) {
        wx.config({
//          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
//                alert("分享给朋友OK");
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
//               alert("分享给朋友cancel");
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
      _getWxJsApiConfig () {
        this.loadingTxt = '环境初始化中...';
//        alert(window.location.href);
//        this.$refs.loading.show();
        let params = {
          url: window.location.href
        };
        return getWxJsApiConfig(params);
      },
      ...mapMutations({
        recordSystemInfo: 'RECORD_SYSTEMINFO'
      })
    },
    components: {
      'g-tab': Tab,
      TopTip
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./index";
</style>

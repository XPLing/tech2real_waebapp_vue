<template>
  <div class="c-share" :class="{'active':showFlag}">
    <div v-show="showFlag">
      <div class="bg-layer" @click="hide"></div>
      <transition name="drop-down">
        <div v-show="showFlag" class="share-wrapper">
          <div class="cont">
            <div v-if="!noSelf" class="to-clubs" @click="share(-1)">
              <div class="avatar">
                <img src="./clubs.png">
              </div>
              <div class="desc">
                <p class="title">分享到硬见社群</p>
                <p class="subtitle">与工程师们分享您的想法</p>
              </div>
            </div>
            <div class="split">分享到社交平台</div>
            <div class="to-vendor">
              <img class="item" src="./wechat.png" @click="share('weixin')">
              <img class="item" src="./qzone.png" @click="share('friends')">
              <img class="item" src="./qq.png" @click="share('qq')">
              <img class="item" src="./weibo.png" @click="share('sina')">
            </div>
          </div>
          <div class="operate">
            <button class="btn cancel" @click="cancel">取消</button>
          </div>
        </div>
      </transition>
    </div>
    <wechat-share-guide ref="wechatShareGuide"></wechat-share-guide>
    <confirm ref="confirmsWrapper" :is-dialog="true" :text="confirmTxt"></confirm>
  </div>

</template>

<script type="text/ecmascript-6">
  import Confirm from 'base/confirm/confirm';
  import WechatShareGuide from 'base/wechat-share-guide/wechat-share-guide';
  import { share, thirdParty, ERR_OK } from 'api/config';
  import { getWxJsApiConfig } from 'api/pay';
  import * as util from 'assets/js/util';
  import wx from 'weixin-js-sdk';
  // shareType; // -1 社群，1 微信,2 qq空间，3 qq，4 微博；
  export default {
    props: {
      data: {
        type: Object,
        default: null
      },
      noSelf: {
        type: Boolean,
        default: false
      },
      shareInfo: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        showFlag: false,
        confirmTxt: '请在微信打开此网页'
      };
    },
    created () {
      var browser = util.common.getbrowserType();
      this.isWechat = /^1.*/.test(browser);
    },
    methods: {
      hide () {
        this.showFlag = false;
      },
      show () {
        this.showFlag = true;
      },
      cancel () {
        this.hide();
        this.$emit('cancel');
      },
      share (data) {
        var shareInfo = this.shareInfo ? Object.assign({}, share, this.shareInfo) : share,
          isPro = process.env.NODE_ENV === 'production';
        var shareUrl = shareInfo.url, shareAPIUrl = '', isOpen = true, shareConfig = {},
          currentUrl = window.location.href;
        if (!isPro) {
          shareUrl = shareInfo.devUrl;
        }

        switch (data) {
          case -1:
            isOpen = false;
            break;
          case 'weixin':
          case 'friends':
            if (this.isWechat) {
              this.$refs.wechatShareGuide.show();
            } else {
              this.$refs.confirmsWrapper.show();
            }
            isOpen = false;
            break;
          case 'sina':
            shareConfig = {
              url: shareUrl,
              title: shareInfo.title,
              pic: shareInfo.cover,
              source: shareInfo.source, /* 分享来源 (可选) ，如：QQ分享 */
              appkey: thirdParty.weibo.appId
            };
            shareAPIUrl = 'http://service.weibo.com/share/share.php';
            break;
          case 'qq':
            shareConfig = {
              url: shareUrl, /* 获取URL，可加上来自分享到QQ标识，方便统计 */
//              desc: shareInfo.desc, // 分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）
              title: shareInfo.title, // 分享标题(可选)
              summary: shareInfo.summary, /* 分享描述(可选) */
              pics: shareInfo.cover, /* 分享图片(可选) */
//              flash: '', /* 视频地址(可选) */
              // commonClient : true, /*客户端嵌入标志*/
              site: shareInfo.source /* 分享来源 (可选) ，如：QQ分享 */
            };
            // 使用http://connect.qq.com/widget/shareqq/iframe_index.html链接，iframe_index.html是弹出层效果，index.html是新打开页面效果
            shareAPIUrl = 'http://connect.qq.com/widget/shareqq/index.html';
            break;
        }
        if (isOpen) {
          this.hide();
          var params = [];
          for (var i in shareConfig) {
            params.push(i + '=' + encodeURIComponent(shareConfig[i] || ''));
          }
          var _src = shareAPIUrl + '?' + params.join('&');
          window.open(_src);
        } else {

        }
        this.$emit('share', data);
      },
      initWeixinShare () {
        this._getWxJsApiConfig().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            this.wxInit(res);
          }
        }).catch(e => {
          this.$emit('error', e);
        }).finally(() => {
          this.$emit('getConfigEnd');
        });
      },
      wxInit (data) {
        let shareInfo = this.shareInfo;
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.result.appId, // 必填，公众号的唯一标识
          timestamp: data.result.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.result.nonceStr, // 必填，生成签名的随机串
          signature: data.result.signature, // 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          // alert('ready');
          //  alert(imgUrl);
          wx.onMenuShareTimeline({//  分享到朋友圈
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.url, // 分享链接
            imgUrl: shareInfo.cover // 分享图标
          });
          wx.onMenuShareAppMessage({//  分享给朋友
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.url, // 分享链接
            imgUrl: shareInfo.cover, // 分享图标
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
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.url, // 分享链接
            imgUrl: shareInfo.cover // 分享图标
          });
          wx.onMenuShareWeibo({// 分享到腾讯微博
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.url, // 分享链接
            imgUrl: shareInfo.cover // 分享图标
          });
          wx.onMenuShareQZone({// 分享到QQ空间
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.url, // 分享链接
            imgUrl: shareInfo.cover // 分享图标
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
//        alert(window.location.href);
        this.$emit('getConfigStart');
        let params = {
          url: window.location.href
        };
        return getWxJsApiConfig(params, {
          concurrent: true
        });
      }
    },
    watch: {
      shareInfo (newVal) {
        if (!newVal || !this.isWechat) {
          return false;
        }
        this.initWeixinShare();
      }
    },
    components: {
      Confirm,
      WechatShareGuide
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./share";
</style>

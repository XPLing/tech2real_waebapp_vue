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
  import { share, thirdParty } from 'api/config';
  import * as util from 'assets/js/util';
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
        var shareInfo = this.shareInfo ? this.shareInfo : share;
        var shareUrl = shareInfo.appUrl, shareAPIUrl = '', isOpen = true, shareConfig = {},
          currentUrl = window.location.href;
        if (/open.dev./.test(currentUrl)) {
          shareUrl = shareInfo.appDevUrl;
        }
        var browser = util.common.getbrowserType();
        var isWechat = /^1.*/.test(browser);
        switch (data) {
          case 'weixin':
          case 'friends':
            if (isWechat) {
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

<template>
  <transition name="slide">
    <div class="g-account-safety">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
            <div class="chunk vendor">
              <ul class="list">
                <li class="item" v-for="(item, index) in vList" :key="index" @click="bandVendor(item)">
                  <div class="left">
                    <img class="icon" :src="item.icon">
                    <p class="name">{{item.name}}</p>
                  </div>
                  <div class="right">
                    <p class="status" :class="{'unband':!item.isBand}">{{item.isBand ? '已绑定' : '去绑定'}}</p>
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
              </ul>
            </div>
            <div class="chunk resetPW">
              <ul class="list">
                <li class="item" @click="toResetPW">
                  <div class="left">
                    <img class="icon" src="./lock.png">
                    <p class="name">修改密码</p>
                  </div>
                  <div class="right">
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
      <confirm :text="operateTip" ref="confirm" @confirm="confirm"></confirm>
      <loading ref="loading"></loading>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <router-view v-if="isRouterAlive"></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { thirdParty, ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import NoResult from 'base/no-result/no-result';
  import { unbindThirdParty } from 'api/login';

  export default {
    provide () {
      return {
        reload: this.reload
      };
    },
    data () {
      return {
        pageTitle: '设置',
        isRouterAlive: true,
        toptipTxt: '',
        operateTip: '确定解绑？',
        vList: [
          {
            type: 'weixin',
            name: '微信',
            icon: require('./wechat.png'),
            isBand: false,
            flag: 'wechatUnionId'
          },
          {
            type: 'qq',
            name: 'QQ',
            icon: require('./qq.png'),
            isBand: false,
            flag: 'qqOpenId'
          },
          {
            type: 'sina',
            name: '新浪微博',
            icon: require('./weibo.png'),
            isBand: false,
            flag: 'sinaId'
          }
        ]
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
      if (this.userInfo) {
        this.resetVendorDate();
      }
    },
    methods: {
      confirm () {
        var type = this.currentBandVendor.type;
        this._unbindThirdParty(type).then(res => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return false;
            }
            this.updateUserInfo(res.result);
          }
        }).catch(erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      thirdPartLogin (type) {
        var url = '', uri = '', href = '';
        var uriKey = 'bindUri', appIdKey = 'appId', currentUrl = window.location.href;
        if (/open.dev./.test(currentUrl)) {
          uriKey = 'devBindUri';
          appIdKey = 'devAppId';
        }
        uriKey = 'devBindUri';
        switch (type) {
          case 'weixin':
            url = thirdParty.wechat.url;
            uri = encodeURIComponent(thirdParty.wechat[uriKey] + '?thridparty=weixin');
            if (util.browser.versions.mobile) {
              url = thirdParty.wechat.webUrl;
            }
            href = url + '?appid=' + thirdParty.wechat[appIdKey] + '&redirect_uri=' + uri + '&response_type=code&scope=snsapi_userinfo&state=' + util.uuid(8, 16) + '#wechat_redirect';
            break;
          case 'qq':
            url = thirdParty.qq.url;
            uri = encodeURIComponent(thirdParty.qq[uriKey] + '?thridparty=qq');
            href = url + '?client_id=' + thirdParty.qq[appIdKey] + '&redirect_uri=' + uri + '&response_type=code&scope=get_user_info&state=' + util.uuid(8, 16);
            /*  if (util.browser.mobile) {
                url = thirdParty.qq.webUrl;
                href = url + "?client_id=" + thirdParty.qq[appIdKey] + "&redirect_uri=" + uri + "display=mobile&response_type=code&scope=get_user_info&state=" + util.uuid(8, 16);
            } */
            break;
          case 'sina':
            url = thirdParty.weibo.url;
            uri = encodeURIComponent(thirdParty.weibo[uriKey] + '?thridparty=sina');
            if (util.browser.versions.mobile) {
              url = thirdParty.weibo.webUrl;
            }
            href = url + '?client_id=' + thirdParty.weibo[appIdKey] + '&response_type=code&scope=all&state=' + util.uuid(8, 16) + '&redirect_uri=' + uri;
            break;
        }
        window.location.href = href;
      },
      bandVendor (data) {
        this.currentBandVendor = data;
        if (data.isBand) {
          this.$refs.confirm.show();
        } else {
          // this.$refs.loading.show();
          this.updataBeforeLoginPage(this.$route.path);
          this.thirdPartLogin(data.type);
//        this.$router.push({
//          path: 'bindMobile',
//          append: true
//        });
        }

      },
      resetVendorDate () {
        for (var i = 0, len = this.vList.length; i < len; i++) {
          var item = this.vList[i];
          if (this.userInfo[item.flag]) {
            item.isBand = true;
          } else {
            item.isBand = false;
          }
        }
      },
      toResetPW () {
        this.$router.push({
          path: 'resetPW',
          append: true
        });
      },
      _unbindThirdParty (type) {
        var param = {
          third_party: type,
          product_guid: this.productGuid,
          user_guid: this.userGuid,
          clientType: 1
        };
        return unbindThirdParty(param);
      },
      ...mapActions([
        'updateUserInfo'
      ]),
      ...mapMutations({
        updataBeforeLoginPage: 'UPDATA_BEFORELOGINPAGE'
      })
    },
    watch: {
      userInfo () {
        this.resetVendorDate();
      }
    },
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      Confirm,
      TopTip,
      Loading,
      Scroll,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./safety";
</style>

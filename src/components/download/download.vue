<template>
  <div class="c-download-app" :class="isFixed?'fixed':''">
    <transition name="slide">
      <div class="download-app-wrapper" v-show="showFlag">
        <div class="download-app">
          <div class="info">
            <div class="avatar">
              <img src="./logo.png" alt="硬见">
            </div>
            <div class="desc">
              <p class="name">云创硬见</p>
              <p class="intro">智慧连接硬件创新</p>
            </div>
          </div>
          <div class="btn" @click="toDownload">打开硬见</div>
        </div>
      </div>
    </transition>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getProductAppSetup } from 'api/app';
  import * as util from 'assets/js/util';
  import TopTip from 'base/top-tip/top-tip';
  import { mapGetters } from 'vuex';
  import { ERR_OK } from 'api/config';

  export default {
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      isFixed: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        toptipTxt: '',
        downloadUrl: '',
        showFlag: true
      };
    },
    created () {
      this.showFlag = this.isShow;
    },
    mounted () {
      this._getProductAppSetup('yingyongbaoUrl').then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            return Promise.reject();
          }
//          this.downloadUrl = this.src = res.result.value;
          this.$set(this.$data, 'downloadUrl', res.result.value);
        }
      }).catch(erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      toDownload () {
        window.location = this.downloadUrl;
//        util.common.openClient('tech2real', this.downloadUrl);
      },
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      _getProductAppSetup (type) {
        var param = {
          product_guid: this.productGuid,
          module: 'common',
          item: type
        };
        return getProductAppSetup(param);
      }
    },
    components: {
      TopTip
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "download";
</style>

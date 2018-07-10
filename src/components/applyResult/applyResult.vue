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
              <div class="price">
                <i class="fa" :class="applyInfo.applyState==1?'fa-check-circle': applyInfo.applyState==5?'fa-times-circle':'fa-exclamation-circle'" aria-hidden="true"></i>
                <span>{{applyState}}</span>
              </div>
              <div class="intro" v-if="applyInfo">
                <course-list :apply-result-base="applyInfo.activity" :apply-result-detail="applyInfo.ticket"  :apply-result="applyInfo"
                             @selectcourse="selectApplyTarget"></course-list>
              </div>
            </div>
            <div class="apply-tip">
              <div class="tip">
                <p class="item">·请在30分钟内支付成功，否则系统将取消订单；</p>
                <p class="item"> ·请检查报名信息，一经报名恕不办理退款；</p>
              </div>
              <div class="control">
                <button class="btn cancel">取消报名</button>
                <button class="btn confirm">去支付（还剩15分30秒）</button>
              </div>
            </div>
            <div class="apply-detail">
              <div class="chunk title">
                <p>详细信息</p>
              </div>
              <div class="chunk time">
                <p class="time">活动时间：{{ applyInfo.activity.startTime | formatDate('yyyy-MM-dd')}}</p>
                <p class="address">活动地址：{{ applyInfo.activity.province + applyInfo.activity.city + applyInfo.activity.district}}</p>
              </div>
              <div class="chunk info-collect" v-if="applyInfo.infoCollections">
                <p v-for="(item,index) in applyInfo.infoCollections" :key="index">
                  {{item.settingName}}：{{item.value}}
                </p>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import CourseList from 'base/applyResult-item/applyResult-item';
  import Scroll from 'base/scroll/scroll';
  import * as util from 'assets/js/util';
  import { getApplyByActivityId } from 'api/activity';
  import { ERR_OK } from 'api/config';
  import Loading from 'base/loading/loading';
  import TopTip from 'base/top-tip/top-tip';
  import { mapGetters, mapMutations } from 'vuex';

  var APPLYSTATE = ['完成', '报名取消', '待支付', '待审核', '审核驳回'];

  export default {
    props: {
      applyResult: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageTitle: '报名详情',
        hasBack: true,
        routerPrefix: util.routerPrefix,
        applyInfo: null,
        applyState: '',
        toptipTxt: '',
        order: null
      };
    },
    created () {
      this.applyTargetID = this.$route.params.id;
      this._getApplyByActivityId().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.applyInfo = res.result;
          this.initDate();
        }
      }, erro => {
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
      initDate () {
        /* applyState: 1:完成  2:取消  3:预留（代付款） 4:待审核  5:审核驳回 */
        var applyState = this.applyInfo.applyState;
        this.applyState = APPLYSTATE[applyState - 1];
        this.order = this.applyInfo.applyState;
        switch (applyState) {
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
          case 5:
            break;
        }
      },
      selectApplyTarget (courseID) {
        this.$router.back();
      },
      _getApplyByActivityId (infoCollections) {
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
      CourseList,
      Scroll,
      Loading,
      TopTip
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "applyResult";
</style>

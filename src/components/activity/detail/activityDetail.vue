<template>
  <transition name="slide">
    <div class="g-activity-detail">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :refreshDelay="10000" :data="dataInfo" @scroll="descImage" ref="scroll" :probeType="probeType"
                :listenScroll="listenScroll">
          <div class="scroll-box">
            <div class="g-banner" v-if="dataInfo">
              <img :src="dataInfo.coverUrl"/>
              <div class="intro">
                <p class="title">{{dataInfo.title}}</p>
                <p class="sub-info">
                  <i class="icon fa fa-map-marker"></i>
                  <span>{{dataInfo.city}}</span>
                  <span>{{dataInfo.startTime | formatDate('yyyy/MM/dd hh:mm')}}</span>
                </p>
              </div>
            </div>
            <div class="info-base" v-if="dataInfo">
              <div class="item sponsor">
                <p>
                  <span class="name">主办方</span>
                  <span class="cont">{{dataInfo.sponsor}}</span>
                </p>
              </div>
              <div class="item">
                <p>
                  <span class="name">时间</span>
                  <span
                    class="cont">{{dataInfo.applyStartTime | formatDate('yyyy/MM/dd hh:mm')}} ~ {{dataInfo.applyEndTime | formatDate('yyyy/MM/dd hh:mm')}}</span>
                </p>
                <p>
                  <span class="name">地点</span>
                  <span class="cont">{{dataInfo.province + dataInfo.district}}</span>
                </p>
                <p>
                  <span class="name">费用</span>
                  <span class="cont">{{dataInfo.minPrice === 0 ? '免费' : dataInfo.minPrice}}</span>
                </p>
              </div>
            </div>
            <div class="info-detail" v-if="dataInfo">
              <p class="title">活动详情</p>
              <div ref="brief" class="brief" v-html="dataInfo.brief"></div>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom-btn" v-if="dataInfo">
        <div class="control-bar">
          <p @click.stop="showShare">
            <i class="icon c-icon-share"></i>
            <span class="name">分享</span>
          </p>
          <router-link tag="p"
                       :to="{path:`/activity/list/detail/${this.id}/commentlist`,query: {title: `${this.pageTitle}`}}">
            <i class="icon c-icon-comment-square-o"></i>
            <span class="name">评论</span>
          </router-link>
        </div>
        <p class="btn disable" v-if="applyStatus.isDisable">{{applyStatus.value}}</p>
        <p class="btn" v-else @click="applyActivity">{{applyStatus.value}}</p>
      </div>
      <share @cancel="cancelShare" @share="share" ref="share"></share>
      <back-top ref="backTop" @backTop="backTop"></back-top>
      <router-view :comment-form-placeholder="'请输入评论内容'" :type="'comment'" :activity="dataInfo" @applyUpdate="applyUpdate"></router-view>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @confirm="confirm"></confirm>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import NoResult from 'base/no-result/no-result';
  import { getActivityById } from 'api/activity';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import ActivityList from 'base/activity-list/activity-list';
  import Share from 'base/share/share';

  export default {
//    beforeRouteEnter (to, from, next) {
//      next((vm) => {
//        if (/activity/.test(from.name)) {
//        }
//      });
//    },
    data () {
      return {
        toptipTxt: '',
        pageTitle: '活动详情',
        dataInfo: null,
        probeType: 3,
        listenScroll: true,
        scrollY: 0,
        introImgs: [],
        loadedImgs: [],
        imgsLoadStatus: 'ready',
        confirmTxt: ''
      };
    },
    created () {
      this.id = this.$route.params.id;
    },
    mounted () {
      this.initDate();
    },
    computed: {
      loadingImgs () {
        var arr = [];
        if (this.loadedImgs.length > 0) {
          for (var i = 0, len = this.introImgs.length; i < len; i++) {
            var item = this.introImgs[i];
            for (var j = 0, jlen = this.loadedImgs.length; j < jlen; j++) {
              var jitem = this.loadedImgs[i];
              if (jitem !== item) {
                arr.push(item);
              }
            }
          }
        } else {
          arr = this.introImgs;
        }
        return arr;
      },
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      applyUpdate(){

      },
      confirm(){},
      initDate () {
        this._getActivityById().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.dataInfo = res.result;
            this.pageTitle = res.result.title;
            this.applyStatus = this.applyStatusValue(res.result.applyStatus);
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      cancelShare () {},
      showShare () {
        this.$refs.share.show();
      },
      share (data) {
        if (data < 0) {
          this.$router.push({
            name: 'community_commentFormRoot',
            params: {
              shareData: this.dataInfo,
              shareType: 3
            }
          });

        } else if (data === 1) {

        } else if (data === 2) {

        } else if (data === 3) {

        } else if (data === 4) {

        }
      },
      applyStatusValue (status) {
        var value = '', isDisable = false;
        switch (status) {
          case 1:
            value = '即将开始';
            isDisable = true;
            break;
          case 2:
            value = '立即报名';
            break;
          case 3:
            value = '门票售罄';
            isDisable = true;
            break;
          case 4:
            value = '报名截止';
            isDisable = true;
            break;
          case 5:
            value = '已报名';
            break;
          case 6:
            value = '审核中';
            break;
          case 7:
            value = '未通过';
            break;
          case 8:
            value = '待支付';
            break;
          case 9:
            value = '被驳回';
            break;
          case 10:
            value = '重新报名';
            break;
          case 11:
            value = '活动结束';
            isDisable = true;
            break;
        }
        return {
          index: status,
          value,
          isDisable
        };
      },
      applyActivity () {
        /* 1、即将开始  2、立即报名  3、门票售罄  4、报名截止  5、已报名  6、待审核  7、未通过  8、待支付  9、被驳回  10、重新报名  11、活动结束 */
        if (this.applyStatus.index === 2 || this.applyStatus.index === 10) {
          this.$router.push({
            path: `/activity/list/detail/${this.id}/ticketList`,
            append: true
          });
        } else if (this.applyStatus.index === 5 || this.applyStatus.index === 6 || this.applyStatus.index === 7 || this.applyStatus.index === 8 || this.applyStatus.index === 9) {
          this.$router.push({
            path: `applyresult`,
            append: true
          });
        }
      },
      descImage (pos) {
        this.scrollY = pos.y;
        if (this.loadingImgs.length > 0 && this.imgsLoadStatus === 'ready') {
          var imgs = this.loadingImgs;
          this.imgsLoadStatus = 'loading';
          if (imgs.length < 0) {
            this.imgsLoadStatus = 'loaded';
            return;
          }
          Promise.all(imgOnload(imgs, this, 'descImageLoaded')).then((res) => {
            this.imgsLoadStatus = 'loaded';
            this.loadedImgs = res;
            this.$nextTick(() => {
              this.$refs.scroll.refresh();
            });
//            if (res.loaded.length === this.introImgs.length) {
//              // this.$refs.scroll.scroll.off('scroll');
//            }
          }).catch(() => {
            this.imgsLoadStatus = 'error';
            this.confirmTxt = '网络出错请重新加载！';
          });
        } else {
          // this.$refs.scroll.scroll.off('scroll');
        }
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      _getActivityById () {
        var param = {
          id: this.id,
          userGuid: this.userGuid
        };
        return getActivityById(param);
      }
    },
    watch: {
      dataInfo () {
        this.$nextTick(() => {
          this.introImgs = [];
          var nodelist = this.$refs.brief.querySelectorAll('img');
          for (var i = 0, len = nodelist.length; i < len; i++) {
            this.introImgs.push(nodelist[i]);
          }
        });
      },
      scrollY (newVal) {
        if (newVal < -100) {
          if (!this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.showIcon();
          }
        } else {
          if (this.$refs.backTop.backTopShowFlag) {
            this.$refs.backTop.hideIcon();
          }
        }
      }
    },
    components: {
      HeaderTitle,
      TopTip,
      Loading,
      Scroll,
      BackTop,
      NoResult,
      ActivityList,
      Share,
      Confirm
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./activityDetail";


</style>

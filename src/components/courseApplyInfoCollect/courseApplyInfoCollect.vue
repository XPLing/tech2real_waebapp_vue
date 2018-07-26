<template>
  <transition name="slide">
    <div class="g-course-apply-infocollect">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="info-collect-wrapper" ref="scrollDom">
        <div class="g-scroll-continer" v-if="infoCollectData">
          <!--<form class="c-form" data-vv-scope="infoCollect">-->
          <info-collect ref="infoCollect" :collect-target-data="infoCollectData"
                        @showselect="showSelect" @submitForm="validateForm"></info-collect>
          <!--</form>-->
        </div>
        <div class="no-result" v-else>
          <no-result :title="'暂无报名信息~~'"></no-result>
        </div>
      </div>
      <div class="g-select-box">
        <g-select :select-data="selectOpts" :current-select="currentSelect" ref="select"
                  @select="selectItem"></g-select>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
      <!--<buttom-btn-full v-if="applyResult" :btnstr="'提交信息'" @bottomconfirm="validateForm()"-->
      <!--ref="buttomBtn"></buttom-btn-full>-->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import HeaderTitle from 'components/header-title/header-title';
  import ButtomBtnFull from 'base/bottom-btn-full/bottom-btn-full';
  import CourseList from 'base/course-list/course-list';
  import Scroll from 'base/scroll/scroll';
  import InfoCollect from 'base/infoCollect/infoCollect';
  import * as util from 'assets/js/util';
  import { Validator, ErrorBag } from 'vee-validate';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import Select from 'base/select/select';
  import { applyCourse } from 'api/courseDetail';
  import { mapGetters, mapMutations } from 'vuex';
  import { ERR_OK } from 'api/config';
  import { listInfoCollectionsByGuid } from 'api/apply';
  import Loading from 'base/loading/loading';
  import TopTip from 'base/top-tip/top-tip';
  import NoResult from 'base/no-result/no-result';
  import { Toast } from 'mint-ui';

  export default {
    props: {
      applyResult: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageTitle: '报名信息',
        hasBack: true,
        routerPrefix: util.routerPrefix,
        isActiving: false,
        applyTargetID: 0,
        applyTargetGuid: 0,
        selectData: null,
        selectOpts: null,
        selectFlag: false,
        currentSelect: -1,
        toptipTxt: '',
        infoCollectData: null
      };
    },
    created () {
      this._getTargetGuid();
      this._listInfoCollectionsByGuid().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.infoCollectData = res.result;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    computed: {
      courseList () {
        var list = [];
        if (this.courseData) {
          list.push(this.courseData.courseResult.result);
        }
        return list;
      },
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      selectItem (item, index) {
        this.currentSelect = index;
        this.$refs.infoCollect.filedName[`info_${item.settingId}`].value = item.title;
      },
      showSelect (data) {
        this.selectData = data;
        this.selectOpts = data.items;
        this.$refs.select.show();
      },
      _getTargetGuid () {
        this.applyTargetID = this.$route.params.id;
        this.applyTargetGuid = this.$route.params.applyTargetGuid;
        this.ticketId = this.$route.params.ticketId;
      },
      selectCourse (applyTargetID) {
        this.$router.back();
      },
      scrollRefresh () {
        this.$refs.scroll.refresh();
      },
      validateForm (submitBtn) {
        this.$refs.infoCollect.validateForm().then((res) => {
          if (res) {
            submitBtn.changeSubmitBtn(true);
            var infoCollect = [], filedName = this.$refs.infoCollect.filedName;
            Object.keys(filedName).forEach((key, index, val) => {
              var item = filedName[key], newItem = {};
              newItem.settingId = item.id;
              newItem.value = Object.prototype.toString.call(item.value) == '[object Array]' ? item.value.join('|') : item.value;
              newItem.settingName = item.name;
              if (item.type == 3) {
                newItem.value = new Date(newItem.value.toString()).getTime();
              }
              infoCollect.push(newItem);
            });
            this.$refs.loading.show();
            this._applyCourse(infoCollect).then((res) => {
              this.$emit('changeapplyres', res.result);
              submitBtn.changeSubmitBtn(false);
              this.$refs.loading.hide();
              if (res.code == ERR_OK) {
                this.$emit('updateResult', res.result);
                this.$router.replace({
                  path: `/train/${this.applyTargetID}/applyresult`,
                  query: {
                    applyId: res.result.id
                  }
                });
              } else if (res.code == '201') {
                this.$emit('updateResult', res.result);
                this.$router.replace({
                  path: `/train/${this.applyTargetID}/applypay`
                });
              } else {
                submitBtn.changeSubmitBtn(false);
                this.$refs.loading.hide();
                util.common.request.tipMsg(this, res);
              }
            }, erro => {
              submitBtn.changeSubmitBtn(false);
              this.$refs.loading.hide();
              util.common.request.tipMsg(this, erro);
            });
          } else {
            // this.$refs.scroll.scrollTo(0, 0, 300);
            Toast({
              message: '信息有误，请检查！',
              duration: 2000,
              className: 'c-toast w200'
            });
            this.$refs.scrollDom.scrollTop = 0;
          }
        }, (erro) => {
          console.log('Form erro!');
        });
      },
      _applyCourse (infoCollections) {
        let params = {
          id: this.applyTargetID,
          userGuid: this.userGuid,
          productGuid: this.productGuid,
          infoCollections: infoCollections,
          courseValidityPeriodId: this.applyResult.courseValidityPeriod.id
        };
        return applyCourse(params);
      },
      _listInfoCollectionsByGuid (infoCollections) {
        let params = {
          guid: this.applyTargetGuid,
          userGuid: this.userGuid,
          productGuid: this.productGuid
        };
        return listInfoCollectionsByGuid(params);
      }
    },
    components: {
      HeaderTitle,
      CourseList,
      Scroll,
      InfoCollect,
      ButtomBtnFull,
      'g-select': Select,
      Loading,
      TopTip,
      NoResult
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./courseApplyInfoCollect";
</style>

<template>
  <transition name="slide">
    <div class="g-course-apply-infocollect">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="hasBack"></HeaderTitle>
      </header>
      <div class="info-collect-wrapper">
        <scroll :data="applyResult" ref="scroll">
          <div class="g-scroll-continer" v-if="applyResult">
            <!--<form class="c-form" data-vv-scope="infoCollect">-->
            <info-collect @refresh="scrollRefresh" ref="infoCollect" :info-collect-data="applyResult.infoColletions"
                          @showselect="showSelect"></info-collect>
            <!--</form>-->
          </div>
          <div class="no-result" v-else>
            <no-result :title="'暂无报名信息~~'"></no-result>
          </div>
        </scroll>
      </div>
      <div class="g-select-box">
        <g-select :select-data="selectOpts" :current-select="currentSelect" ref="select"
                  @select="selectItem"></g-select>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
      <buttom-btn-full v-if="applyResult && applyResult.length>0" :btnstr="'提交信息'" @bottomconfirm="validateForm()"
                       ref="buttomBtn"></buttom-btn-full>
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
  import Loading from 'base/loading/loading';
  import TopTip from 'base/top-tip/top-tip';
  import NoResult from 'base/no-result/no-result';

  export default {
    props: {
      applyResult: {
        type: Object,
        default () {
          return {
            'id': 67,
            'guid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
            'productGuid': 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
            'clubGuid': '000',
            'teacherIds': ',30,',
            'teacherNames': '硬见姐姐',
            'coverUrl': 'https://dn-funnymeet.qbox.me/FjVz2gCNVzoDMSxDoAeUNrPXncu3',
            'coverHash': 'FjVz2gCNVzoDMSxDoAeUNrPXncu3',
            'title': 'Johnay的ios之路',
            'startTime': 1524451114000,
            'endTime': null,
            'brief': '<p><img src="https://dn-funnymeet.qbox.me/Ftp-OVD04YUURlgVoam0_7kV_Eh6?e=1831520986&token=u0R-dgswbXXA1PMGqJlkEIo8pc_iWtp5OuM67d94:-8L2ikIEXhE-XQdQoS1xYbkfX5w=" title="" alt="upfile"/></p>',
            'tags': '硬见公开课,',
            'tagIds': ',38,',
            'price': 0.01,
            'originalPrice': 0,
            'status': 2,
            'chapterCount': 0,
            'applyTotalCount': 0,
            'applyCount': 5,
            'applyRemainCount': 0,
            'isRecommend': 'Y',
            'tip': '持续更新',
            'ps': null,
            'deleteFlag': 'N',
            'clubName': '云创硬见',
            'teachers': [
              {
                'deleteFlag': 'N',
                'id': 30,
                'productGuid': 'a5c72d76-16dc-4bb6-b6af-f2e562b1839b',
                'userGuid': '056d529c-936f-4d29-b1bc-44a991c9555c',
                'career': '云创硬见官方节目',
                'brief': '由云创硬见特别策划的硬件知识栏目。\n以轻松趣味的手绘方式讲解硬件小知识，帮助学生或者刚入行朋友快速了解硬件知识，加深对硬件知识点的记忆。',
                'courseBrief': '硬件基本知识点讲解\n部分硬件实现原理解析',
                'state': 1,
                'isRecommend': 'Y',
                'faceHash': 'FgtrVVWzXJCrPX2FaoPf-cMZi5KK',
                'faceUrl': 'https://dn-funnymeet.qbox.me/FgtrVVWzXJCrPX2FaoPf-cMZi5KK?e=1820133237&token=u0R-dgswbXXA1PMGqJlkEIo8pc_iWtp5OuM67d94:54mq02g7NvwXKoP1YZZnEA4wSJ8=',
                'realName': '硬见姐姐',
                'nickname': '硬见姐姐',
                'mobile': '18028734183',
                'courseCount': 0
              }
            ],
            'needInfo': false,
            'myEvaluate': null,
            'appliedState': 0,
            'evaluateCount': 0,
            'commentCount': 0,
            'infoCollectionSettings': [
              {
                'id': 953,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 1,
                'title': '姓名',
                'isRequired': 1,
                'tips': '请填写姓名',
                'pattern': null,
                'items': null
              },
              {
                'id': 954,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 1,
                'title': '手机',
                'isRequired': 1,
                'tips': '请填写手机',
                'pattern': '1^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\\d{8}$',
                'items': null
              },
              {
                'id': 955,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 1,
                'title': '单行文本标题',
                'isRequired': 1,
                'tips': '单行文本NER',
                'pattern': null,
                'items': null
              },
              {
                'id': 956,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 2,
                'title': '多行文本标题',
                'isRequired': 0,
                'tips': '多行文本内容',
                'pattern': null,
                'items': null
              },
              {
                'id': 957,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 4,
                'title': '性别',
                'isRequired': 0,
                'tips': '性别',
                'pattern': null,
                'items': [
                  {
                    'id': 415,
                    'settingId': 957,
                    'title': '女',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  },
                  {
                    'id': 416,
                    'settingId': 957,
                    'title': '男',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  }
                ]
              },
              {
                'id': 958,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 5,
                'title': '需要审核',
                'isRequired': 0,
                'tips': '是否审核',
                'pattern': null,
                'items': [
                  {
                    'id': 417,
                    'settingId': 958,
                    'title': '是',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  },
                  {
                    'id': 418,
                    'settingId': 958,
                    'title': '否',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  }
                ]
              },
              {
                'id': 959,
                'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
                'type': 6,
                'title': '爱好',
                'isRequired': 0,
                'tips': '爱好',
                'pattern': null,
                'items': [
                  {
                    'id': 419,
                    'settingId': 959,
                    'title': '运动',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  },
                  {
                    'id': 420,
                    'settingId': 959,
                    'title': '音樂',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  },
                  {
                    'id': 421,
                    'settingId': 959,
                    'title': '閲讀',
                    'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                  }
                ]
              }
            ],
            'courseRecord': null,
            'evaluated': false
          };
        }
      }
    },
    data () {
      return {
        pageTitle: '报名信息',
        hasBack: true,
        routerPrefix: util.routerPrefix,
        isActiving: false,
        courseID: 0,
        selectData: null,
        selectOpts: null,
        selectFlag: false,
        currentSelect: -1,
        toptipTxt: ''
      };
    },
    created () {
      this._getCourseID();
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
      _getCourseID () {
        this.courseID = this.$route.params.id;
      },
      selectCourse (courseID) {
        this.$router.back();
      },
      scrollRefresh () {
        this.$refs.scroll.refresh();
      },
      validateForm () {
        this.$refs.infoCollect.validateForm().then((res) => {
          if (res) {
            this.$refs.buttomBtn.changeSubmitBtn(true);
            var infoCollect = [], filedName = this.$refs.infoCollect.filedName;
            Object.keys(filedName).forEach((key, index, val) => {
              var item = filedName[key], newItem = {};
              newItem.settingId = item.id;
              newItem.value = Object.prototype.toString.call(item.value) == '[object Array]' ? item.value.join('|') : item.value;
              newItem.settingName = item.name;
              infoCollect.push(newItem);
            });
            this.$refs.loading.show();
            this._applyCourse(infoCollect).then((res) => {
              this.$emit('changeapplyres', res.result);
              this.$refs.buttomBtn.changeSubmitBtn(false);
              this.$refs.loading.hide();
              if (res.code == ERR_OK) {
                this.$router.push({
                  path: `/train/${this.courseID}/applyresult`
                });
              } else if (res.code == '201') {
                this.$router.push({
                  path: `/train/${this.courseID}/applypay`
                });
              } else {
                util.common.request.tipMsg(this, res);
              }
            }, erro => {
              this.$refs.buttomBtn.changeSubmitBtn(false);
              this.$refs.loading.hide();
              util.common.request.tipMsg(this, erro);
            });
          }
        }, (erro) => {
          console.log('Form erro!');
        });
      },
      _applyCourse (infoCollections) {
        let params = {
          id: this.courseID,
          userGuid: this.userGuid,
          productGuid: this.productGuid,
          infoCollections: infoCollections
        };
        return applyCourse(params);
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
  @import "courseApplyInfoCollect";
</style>

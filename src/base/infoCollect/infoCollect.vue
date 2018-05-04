<template>
  <div class="g-info-collect">
    <form data-vv-scope="infoCollect">
      <p class="tip">
        注：信息用于报名审核，带*为必填项
      </p>
      <div class="info-group text" v-for="item in info.text" :key="item.id">
        <!--<p class="title">{{item.title}}</p>-->
        <div class="input-item text">
          <div class="name">{{item.title}}</div>
          <div class="cont">
            <input type="text" :name="`info_${item.id}`" v-model="filedName[`info_${item.id}`].value"
                   v-validate="{ required: item.isRequired?true:false, regex: item.pattern?`${item.pattern}`:'' }">
          </div>
        </div>
        <div v-show="errors.has('infoCollect.info_'+item.id)" class="c-tip error">
          <i class="icon fa fa-warning text-danger"></i>
          <span class="meg text-danger">{{ errors.first('infoCollect.info_' + item.id)}}</span>
        </div>
      </div>
      <div class="info-group text" @click="showSelect(item)" v-for="item in info.select" :key="item.id">
        <div class="input-item text">
          <div class="name">{{item.title}}</div>
          <div class="cont">
            <input type="text" :name="`info_${item.id}`" v-model="filedName[`info_${item.id}`].value" readonly="readonly"
                   disabled="disabled" placeholder="请选择"
                   v-validate="{ required: item.isRequired?true:false}">
          </div>
          <i class="icon fa fa-angle-right"></i>
        </div>
        <div v-show="errors.has('infoCollect.info_'+item.id)" class="c-tip error">
          <i class="icon fa fa-warning text-danger"></i>
          <span class="meg text-danger">{{ errors.first('infoCollect.info_' + item.id)}}</span>
        </div>
      </div>
      <div class="info-group" v-for="item in info.textarea" :key="item.id">
        <p class="title">{{item.title}}</p>
        <div class="input-item">
          <div class="cont">
            <textarea v-model="filedName[`info_${item.id}`].value"
                      v-validate="{ required: item.isRequired?true:false, regex: item.pattern?`${item.pattern}`:'' }"></textarea>
          </div>
        </div>
        <div v-show="errors.has('infoCollect.info_'+item.id)" class="c-tip error">
          <i class="icon fa fa-warning text-danger"></i>
          <span class="meg text-danger">{{ errors.first('infoCollect.info_' + item.id)}}</span>
        </div>
      </div>
      <div class="info-group" v-for="item in info.radio" :key="item.id">
        <p class="title">{{item.title}}</p>
        <div class="input-item choice" v-for="opt in item.items" :key="opt.id">
          <input class="float-input" type="radio" v-model="filedName[`info_${item.id}`].value"
                 :name="`info_${item.id}`"
                 :id="`info_${item.id}_${opt.id}`" :value="opt.id"
                 v-validate="{ required: item.isRequired?true:false, in: item.opts }">
          <label class="label" :for="`info_${item.id}_${opt.id}`">
            <p class="btn">
              <i class="icon"
                 :class="filedName[`info_${item.id}`].value === opt.id?['c-icon-check-circle','active']:'c-icon-circle-o'"></i>
            </p>
            <div class="cont">
              {{opt.title}}
            </div>
          </label>
        </div>
      </div>
      <div class="info-group" v-for="item in info.checkbox" :key="item.id">
        <p class="title">{{item.title}}</p>
        <div class="input-item choice" v-for="opt in item.items" :key="opt.id">
          <input class="float-input" type="checkbox" v-model="filedName[`info_${item.id}`].value"
                 :name="`info_${item.id}_${opt.id}`"
                 :id="`info_${item.id}_${opt.id}`" :value="opt.id"
                 v-validate="{ required: item.isRequired?true:false}">
          <label class="label" :for="`info_${item.id}_${opt.id}`">
            <p class="btn">
              <i class="icon"
                 :class="filedName[`info_${item.id}`].value.join('').indexOf(opt.id)>-1?['c-icon-check-square','active']:'c-icon-square-o'"></i>
            </p>
            <div class="cont">
              {{opt.title}}
            </div>
          </label>
        </div>
      </div>
      <form-tip-error :tip-name="'infoCollect.totalMsg'"></form-tip-error>
    </form>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Validator, ErrorBag } from 'vee-validate';
  import FormTipError from 'base/form-tip-error/form-tip-error';

  export default {
    props: {
      infoCollectData: {
        type: Array,
        default () {
          return [
            {
              'id': 946,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 1,
              'title': '姓名',
              'isRequired': 1,
              'tips': '请填写姓名',
              'pattern': null,
              'items': null
            },
            {
              'id': 947,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 1,
              'title': '手机',
              'isRequired': 1,
              'tips': '请填写手机',
              'pattern': '1^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\\d{8}$',
              'items': null
            },
            {
              'id': 948,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 1,
              'title': '单行文本标题',
              'isRequired': 1,
              'tips': '单行文本NER',
              'pattern': null,
              'items': null
            },
            {
              'id': 949,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 2,
              'title': '多行文本标题',
              'isRequired': 0,
              'tips': '多行文本内容',
              'pattern': null,
              'items': null
            },
            {
              'id': 950,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 4,
              'title': '性别',
              'isRequired': 0,
              'tips': '性别',
              'pattern': null,
              'items': [
                {
                  'id': 408,
                  'settingId': 950,
                  'title': '女',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                },
                {
                  'id': 409,
                  'settingId': 950,
                  'title': '男',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                }
              ]
            },
            {
              'id': 951,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 5,
              'title': '需要审核',
              'isRequired': 0,
              'tips': '是否审核',
              'pattern': null,
              'items': [
                {
                  'id': 410,
                  'settingId': 951,
                  'title': '是',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                },
                {
                  'id': 411,
                  'settingId': 951,
                  'title': '否',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                }
              ]
            },
            {
              'id': 952,
              'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b',
              'type': 6,
              'title': '爱好',
              'isRequired': 0,
              'tips': '爱好',
              'pattern': null,
              'items': [
                {
                  'id': 412,
                  'settingId': 952,
                  'title': '运动',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                },
                {
                  'id': 413,
                  'settingId': 952,
                  'title': '音樂',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                },
                {
                  'id': 414,
                  'settingId': 952,
                  'title': '閲讀',
                  'targetGuid': 'f2993ea2-7e47-4457-8cba-164a9a13274b'
                }
              ]
            }
          ];
        }
      }
    },
    data () {
      return {
        showFlag: false,
        payWay: '',
        filedName: {},
        info: {
          radio: [],
          checkbox: [],
          text: [],
          textarea: [],
          select: []
        }
      };
    },
    created () {
      if (this.infoCollectData.length > 0) {
        this.initInfo();
      }
    },
    mounted () {
    },
    methods: {
      showSelect (data) {
        this.$emit('showselect', data);
      },

      confirm () {
        this.hide();
        this.$emit('confirm');
      },
      initInfo () {
        for (var i = 0, len = this.infoCollectData.length; i < len; i++) {
          var item = this.infoCollectData[i],
            setVal = {
              value: ''
            };
          if (this.infoCollectData[i].pattern) {
            item = Object.assign({}, this.infoCollectData[i], {
              pattern: this.infoCollectData[i].pattern.substring(1)
            });
          }
          if (item.type == 6) {
            setVal.value = [];
          }
          setVal.id = item.id;
          setVal.name = item.title;
          this.$set(this.$data.filedName, `info_${item.id}`, setVal);

          var dict = {
            zh_CN: {
              attributes: {
                [`info_${item.id}`]: item.title
              }
            }
          };
          if (item.type == 5 || item.type == 6) {
            dict.custom = {
              [`info_${item.id}`]: {
                required: field => '请勾选' + field
              }
            };
          }
          switch (item.type) {
            case 1:
              this.info.text.push(item);
              break;
            case 2:
              this.info.textarea.push(item);
              break;
            case 4:

              this.info.select.push(item);
              break;
            case 5:
              var opts = [];
              for (var z = 0, optLen = item.items.length; z < optLen; z++) {
                var opt = item.items[z];
                opts.push(`${opt.id}`);
              }
              var items = Object.assign({}, item, {
                opts: opts
              });
              this.info.radio.push(items);
              break;
            case 6:
              this.info.checkbox.push(item);
              break;
          }
          this.$validator.localize(dict);
        }
        setTimeout(() => {
          this.$emit('refresh');
        }, 20);
      },
      validateForm () {
        return this.$validator.validateAll('infoCollect');
      }
    },
    watch: {
      infoCollectData (newVal) {
        this.initInfo();
      },
      errors () {
        setTimeout(() => {
          this.$emit('refresh');
        }, 20);
      },
      info () {
        setTimeout(() => {
          this.$emit('refresh');
        }, 20);
      }
    },
    components: {
      FormTipError
    }
  };
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "infoCollect";
</style>

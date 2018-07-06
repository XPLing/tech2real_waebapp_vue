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
            <input type="text" :name="`info_${item.id}`" :placeholder="item.tips"
                   v-model="filedName[`info_${item.id}`].value"
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
            <input type="text" :name="`info_${item.id}`" :placeholder="item.tips"
                   v-model="filedName[`info_${item.id}`].value" readonly="readonly"
                   disabled="disabled" v-validate="{ required: item.isRequired?true:false}">
          </div>
          <i class="icon fa fa-angle-right"></i>
        </div>
        <div v-show="errors.has('infoCollect.info_'+item.id)" class="c-tip error">
          <i class="icon fa fa-warning text-danger"></i>
          <span class="meg text-danger">{{ errors.first('infoCollect.info_' + item.id)}}</span>
        </div>
      </div>
      <div class="info-group text" v-for="(item, index) in info.timePicker" :key="item.id">
        <div class="input-item text">
          <div class="name">{{item.title}}</div>
          <div class="cont" @click="openPicker(index)">
            <datetime-picker ref="picker" type="time" v-model="filedName[`info_${item.id}`].value"></datetime-picker>
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
            <textarea v-model="filedName[`info_${item.id}`].value" :placeholder="item.tips"
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
    <buttom-btn-full :btnstr="'提交信息'" @bottomconfirm="bottomconfirm"
                     ref="buttomBtn"></buttom-btn-full>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Validator, ErrorBag } from 'vee-validate';
  import FormTipError from 'base/form-tip-error/form-tip-error';
  import ButtomBtnFull from 'base/bottom-btn-full/bottom-btn-full';
  import { DatetimePicker } from 'mint-ui';

  export default {
    props: {
      collectTargetData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        infoCollectData: [],
        showFlag: false,
        payWay: '',
        filedName: {},
        info: {
          radio: [],
          checkbox: [],
          text: [],
          textarea: [],
          timePicker: [],
          select: []
        }
      };
    },
    created () {
      if (this.collectTargetData) {
        this.infoCollectData = this.collectTargetData.infoCollectionSettings;
        if (this.infoCollectData.length > 0) {
          this.initInfo();
        }
      }
    },
    mounted () {
    },
    methods: {
      openPicker (index) {
        this.$refs.picker[index].open();
      },
      showSelect (data) {
        this.$emit('showselect', data);
      },
      confirm () {
        this.hide();
        this.$emit('confirm');
      },
      initInfo () {
        // type: 1 单行填空, 2 多行填空, 3 日期, 4 下拉框, 5 单选,  6 多选
        for (var i = 0, len = this.infoCollectData.length; i < len; i++) {
          var item = this.infoCollectData[i],
            setVal = {
              value: ''
            };
          // 正则得去掉首位字符
          if (this.infoCollectData[i].pattern) {
            item = Object.assign({}, item, {
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
            case 3:
              this.info.timePicker.push(item);
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
      },
      bottomconfirm(){
        this.$emit('submitForm');
      }
    },
    watch: {
      infoCollectData (newVal) {
        // this.initInfo();
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
      FormTipError,
      ButtomBtnFull,
      DatetimePicker
    }
  };
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "infoCollect";
</style>

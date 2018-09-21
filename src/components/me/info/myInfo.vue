<template>
  <transition name="slide">
    <div class="g-setting">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
            <div class="chunk account">
              <ul class="list">
                <li class="item">
                  <p class="name">头像</p>
                  <div class="right">
                    <upload :token="token" :regex="uploadInfo.regex" :type="'avatar'" url="https://up.qbox.me"
                            @uploadComplete="uploadComplete" @uploadError="uploadError"
                            @selectImgs="upDateUpload" ref="upload">
                      <img :src="avatar">
                    </upload>
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
                <li class="item">
                  <p class="name">昵称</p>
                  <div class="right">
                    <input type="text" class="data" v-model="nickname" @blur="changeNickname">
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
                <li class="item">
                  <p class="name">个性签名</p>
                  <div class="right" @click="changePrivateSolgan">
                    <span class="data">{{privateSolgan}}</span>
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
                <li class="item">
                  <p class="name">地区</p>
                  <div class="right" @click="changeAddress">
                    <span class="data">{{province + ' ' + city}}</span>
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
              </ul>
            </div>
            <div class="chunk other">
              <ul class="list">
                <li class="item">
                  <p class="name">性别</p>
                  <div class="right" @click="selectShow('sex')">
                    <span class="data">{{sex}}</span>
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
                <li class="item">
                  <p class="name">年龄</p>
                  <div class="right" @click="selectShow('age')">
                    <span class="data">{{age}}</span>
                    <i class="icon fa fa-angle-right"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
      <g-select :select-data="selectOpts[currentSelectSeries]" :current-select="currentSelect[currentSelectSeries]"
                ref="select"
                @select="selectItem"></g-select>
      <picker @error="pickerError" @confirm="pickerConfirm" ref="picker"></picker>
      <router-view v-if="isRouterAlive"></router-view>
      <confirm :text="operateTip" ref="confirm" @cancel="cancel" @confirm="confirm"></confirm>
      <bottom-form ref="bottomForm" :init-cont="privateSolgan" @confirm="editConfirm"></bottom-form>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapActions } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import Upload from 'base/upload/upload';
  import { getFileCloudToken } from 'api/upload';
  import { setUserInfoByGuid } from 'api/editMyInfo';
  import Select from 'base/select/select';
  import Picker from 'base/picker/picker';
  import BottomForm from 'base/bottom-form/bottom-form';

  export default {
    data () {
      return {
        pageTitle: '编辑资料',
        isRouterAlive: true,
        toptipTxt: '',
        operateTip: '',
        aList: [
          {
            name: '地区',
            path: '',
            right: {
              data: '未设置'
            }
          }
        ],
        oList: [
          {
            name: '性别',
            path: '',
            right: {
              data: '未设置'
            }
          },
          {
            name: '年龄',
            path: '',
            right: {
              data: '未设置'
            }
          }
        ],
        uploadStatus: '',
        uploadInfo: {
          regex: /.jpg|.gif|.png|.bmp/i,
          uploadLimit: 9,
          files: [],
          imgHashes: '',
          remove: null
        },
        token: null,
        nickname: '',
        privateSolgan: '',
        age: '',
        sex: '',
        province: '',
        city: '',
        selectData: {'sex': null, 'age': null},
        selectOpts: {
          'sex': [
            {
              id: 'sex_0',
              title: '男'
            },
            {
              id: 'sex_1',
              title: '女'
            }
          ],
          'age': [
            {
              id: 'age_0',
              title: '50后'
            },
            {
              id: 'age_1',
              title: '60后'
            },
            {
              id: 'age_2',
              title: '70后'
            },
            {
              id: 'age_3',
              title: '80后'
            },
            {
              id: 'age_4',
              title: '90后'
            },
            {
              id: 'age_5',
              title: '00后'
            }
          ]
        },
        currentSelect: {
          'sex': -1,
          'age': -1
        },
        currentSelectSeries: 'sex',
        editShowFlag: false
      };
    },
    computed: {
      avatar () {
        if (!this.userInfo) {
          return '';
        }
        return this.userInfo.faceUrl;
      },
      ...mapGetters([
        'productGuid',
        'userInfo',
        'userGuid'
      ])

    },
    created () {
      this.nickname = this.userInfo.nickname;
      this.privateSolgan = this.privateSolganEdit = this.userInfo.privateSolgan;
      this.city = this.userInfo.city;
      this.province = this.userInfo.province;
      this.sex = this.userInfo.sex;
      this.age = this.userInfo.age;
      this.initSelectOption();
      this._getFileCloudToken().then((res) => {
        if (res.status) {
          if (res.status != ERR_OK_STR) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.token = res.results.token;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    methods: {
      editConfirm (data) {
        this.privateSolgan = data;
        this.setUserInfo({privateSolgan: this.privateSolgan}).then(() => {
          this.privateSolgan = this.privateSolganEdit = this.userInfo.privateSolgan;
        });
      },
      changePrivateSolgan () {
        this.editShowFlag = true;
      },
      changeAddress () {
        this.$refs.picker.show();
      },
      pickerConfirm (data) {
        this.setUserInfo({
          province: data.province,
          city: data.city
        }).then(res => {
          this.city = this.userInfo.city;
          this.province = this.userInfo.province;
        });
      },
      pickerError (e) {
        this.toptipTxt = '获取区域失败，请刷新页面重新获取！';
        this.$refs.toptip.show();
      },
      initSelectOption () {
        for (var i = 0, len = this.selectOpts.sex.length; i < len; i++) {
          var sexItem = this.selectOpts.sex[i];
          if (sexItem.title === this.sex) {
            this.currentSelect.sex = i;
            break;
          }
        }
        for (var j = 0, alen = this.selectOpts.age.length; j < alen; j++) {
          var ageItem = this.selectOpts.age[j];
          if (ageItem.title === this.age) {
            this.currentSelect.age = j;
            break;
          }
        }
      },
      selectShow (type) {
        this.currentSelectSeries = type;
        this.$refs.select.show();
      },
      selectItem (data, index) {
        if (this[this.currentSelectSeries] === data.title) {
          return false;
        }
        var type = '';
        if (this.currentSelectSeries === 'sex') {
          type = 'genderName';
          this.setUserInfo({genderName: data.title});
        } else {
          type = 'age';
        }
        this.setUserInfo({[type]: data.title}).then(() => {
          this.currentSelect[this.currentSelectSeries] = index;
          this[this.currentSelectSeries] = data.title;
        });
      },
      changeNickname () {
        if (this.nickname.trim() === this.userInfo.nickname) {
          return;
        }
        this.operateTip = '确定修改昵称？';
        this.$refs.confirm.show();
      },
      topTipAuto (text) {
        this.toptipTxt = text;
        this.$refs.toptip.show();
        setTimeout(() => {
          this.$refs.toptip.hide();
        }, 2000);
      },
      uploadError (error) {
        var text = '';
        switch (error.type) {
          case 1:
            text = `最多选择${this.uploadInfo.uploadLimit}张图片！`;
            break;
          case 2:
            text = `请选择图片类型的文件！`;
            break;
        }
        this.topTipAuto(text);
      },
      uploadComplete (data) {
        this.uploadStatus = 'uploadComplete';
        this.uploadInfo.files = data;
        this.$refs.loading.hide();
        this.uploadInfo.imgHashes = this.getUploadHash();
        this.setUserInfo({faceHash: this.uploadInfo.imgHashes});
      },
      uploadFiles () {
        this.$refs.loading.show();
        this.uploadStatus = 'uploading';
        this.$refs.upload.upload();
      },
      upDateUpload (data) {
        this.uploadStatus = 'selected';
        this.uploadInfo.files = data;
        this.uploadFiles();
      },
      setUserInfo (data) {
        return this._setUserInfoByGuid(data).then((res) => {
          if (res.status) {
            if (res.status !== ERR_OK_STR) {
              return Promise.reject(res.results);
            }
            this.updateUserInfo(res.results.user);
          }
        }).catch((e) => {
          this.toptipTxt = e.message;
          this.$refs.toptip.show();
        });
      },
      getUploadHash () {
        let values = [];
        for (let key of this.uploadInfo.files) {
          if (key.hash) {
            values.push(key.hash);
          }
        }
        return values.join(',');
      },
      confirm () {
        this.setUserInfo({nickname: this.nickname});
      },
      cancel () {
        this.nickname = this.userInfo.nickname;
      },
      clickItem (data) {
        if (data.path) {
          this.$router.push({
            path: data.path,
            append: true
          });
        }
      },
      _getFileCloudToken () {
        var param = {
          userGuid: this.userGuid
        };
        return getFileCloudToken(param);
      },
      _setUserInfoByGuid (data) {
        var param = {
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        if (data.faceHash) {
          param.faceHash = data.faceHash;
        }
        if (data.nickname) {
          param.nickname = data.nickname;
        }
        if (data.genderName) {
          param.genderName = data.genderName;
        }
        if (data.age) {
          param.age = data.age;
        }
        if (data.city) {
          param.city = data.city;
        }
        if (data.province) {
          param.province = data.province;
        }
        if (data.privateSolgan) {
          param.privateSolgan = data.privateSolgan;
        }
        return setUserInfoByGuid(param);
      },
      ...mapActions([
        'updateUserInfo'
      ])
    },
    components: {
      HeaderTitle,
      Confirm,
      TopTip,
      Loading,
      Scroll,
      Upload,
      Picker,
      'g-select': Select,
      BottomForm
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./myInfo";
</style>

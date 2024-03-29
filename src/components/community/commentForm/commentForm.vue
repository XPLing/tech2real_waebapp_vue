<template>
  <transition name="slide">
    <div class="g-commentForm">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true" :has-operate="true" :operate-str="'发送'"
                     @operate="send"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll ref="scroll">
          <div>
            <div class="top">
              <textarea class="commentForm-cont" name="commentForm" rows="100" v-model="commentFormCont"
                        :placeholder="commentFormPlaceholder"></textarea>
              <template v-if="isShare">
                <div class="share-wrapper">
                  <share-link :data="shareData"></share-link>
                </div>
              </template>
              <template v-else>
                <div class="upload">
                  <div class="img-item" v-for="(item, index) in uploadInfo.files" :key="index" v-if="uploadInfo">
                    <img :src="item.src">
                    <i class="icon" @click="removeUploadFile(item,index)" v-if="uploadStatus !== 'uploadComplete'">x</i>
                  </div>
                  <upload :token="token" :regex="uploadInfo.regex" url="https://up.qbox.me"
                          @uploadComplete="uploadComplete"
                          @cleanUploadFile="cleanUploadFile" @uploadError="uploadError"
                          @selectImgs="upDateUpload" @upDateUpload="upDateUpload" ref="upload"></upload>
                  <!--<uploader url="https://up.qbox.me" :token="token"></uploader>-->
                </div>
                <div class="upload-tools" v-if="uploadInfo && uploadInfo.files.length>0">
                  <button v-if="uploadStatus !== 'uploadComplete'" class="btn upload-btn" @click="uploadFiles">上传图片
                  </button>
                  <button class="btn reupload-btn" v-else @click="cleanFile">重新上传</button>
                </div>
              </template>
            </div>
            <div class="bottom" v-if="favoriteClub && type==='comment'">
              <div class="info-group text">
                <div class="input-item text">
                  <!--@click="toggleCommunityList"-->
                  <div class="name">发布到：</div>
                  <div class="cont">
                    <input :value="clubName" type="text" readonly="readonly" disabled="disabled">
                  </div>
                  <!--<i class="icon fa fa-angle-down" :class="{'active': communityListShowFlag}"></i>-->
                </div>
                <transition name="slide-down" mode="out-in">
                  <div v-show="communityListShowFlag" class="selectList">
                    <p class="title">我关注的社群</p>
                    <ul class="list">
                      <li class="item" v-for="(item, index) in favoriteClub" :key="index" @click="selectClub(item)">
                        <img class="avatar" v-lazy="item.logoUrl">
                        <p class="name">{{item.name}}</p>
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </scroll>
      </div>
      <confirm ref="confirmsWrapper" :text="confirmTxt" @cancel="cancel" @confirm="confirm"></confirm>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
      <loading ref="loading"></loading>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK, ERR_OK_STR } from 'api/config';
  import * as util from 'assets/js/util';
  import { addCommentV2, addCommentReply } from 'api/info';
  import { getFileCloudToken } from 'api/upload';
  import { listMyClubs } from 'api/community';
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Confirm from 'base/confirm/confirm';
  import Upload from 'base/upload/upload';
  import Loading from 'base/loading/loading';
  import ShareLink from 'base/share/link/link-item2';

  /* currentConfirmsOperate打开对话框时当下操作的类型: 1.去登录 2.删除图片 */

  export default {
    name: 'NKA_communityForm',
    props: {
      commentFormPlaceholder: {
        type: String,
        default: '@你想聊点什么？:'
      },
      type: {
        type: String,
        default: 'comment'
      }
    },
    inject: ['reload'],
    data () {
      return {
        confirmTxt: '请先登录!',
        toptipTxt: '',
        pageTitle: '',
        commentFormCont: '',
        communityListShowFlag: false,
        favoriteClub: null,
        clubName: '云创硬见',
        clubId: 1,
        uploadStatus: '',
        uploadInfo: {
          regex: /.jpg|.gif|.png|.bmp/i,
          uploadLimit: 9,
          files: [],
          imgHashes: '',
          remove: null
        },
        token: null,
        isShare: false,
        shareType: 1,
        shareOriginalData: null,
        shareData: null,
        sendFlag: true
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
      this.sendResult = false;
      var routeParams = this.$route.params;
      if (routeParams) {
        if (routeParams.shareData) {
          this.isShare = true;
          this.shareType = routeParams.shareType;
          this.shareOriginalData = routeParams.shareData;

          var titleName = '', coverName = '';
          if (this.shareType === 2) {
            titleName = 'name';
            coverName = 'pictureUrl';
          } else if (this.shareType === 1 || this.shareType === 3) {
            titleName = 'title';
            coverName = 'coverUrl';
          }
          this.shareData = {
            title: this.shareOriginalData[titleName],
            cover: this.shareOriginalData[coverName]
          };
        }
      }
      if (this.type === 'comment') {
        this.pageTitle = '发布新话题';
        this._listMyClubs().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.favoriteClub = res.result;
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      } else {
        this.pageTitle = '评论';
      }
      this._getFileCloudToken().then((res) => {
        if (res.status) {
          if (res.status != ERR_OK_STR) {
            return Promise.reject(res);
          }
          this.token = res.results.token;
        }
      }).catch(error => {
        this.toptipTxt = error.message;
        this.$refs.toptip.show();
      });
    },
    mounted () {
    },
    methods: {
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
      cleanFile () {
        this.$refs.upload.cleanUploadFile();
      },
      cleanUploadFile () {
        this.uploadStatus = 'none';
        this.uploadInfo.files = [];
      },
      uploadComplete (data) {
        this.uploadStatus = 'uploadComplete';
        this.uploadInfo.files = data;
        this.$refs.loading.hide();
      },
      uploadFiles () {
        this.$refs.loading.show();
        this.uploadStatus = 'uploading';
        console.log(this.$refs.upload);
        this.$refs.upload.upload();
      },
      removeUploadFile (item, index) {
        this.confirmTxt = '确定删除该图片？';
        this.uploadInfo.remove = {item, index};
        this.currentConfirmsOperate = 2;
        this.$refs.confirmsWrapper.show();
      },
      upDateUpload (data) {
        this.uploadStatus = 'selected';
        this.uploadInfo.files = data;
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
      selectClub (data) {
        this.clubName = data.name;
        this.clubId = data.id;
        this.hideCommunityList();
      },
      hideCommunityList () {
        this.communityListShowFlag = false;
      },
      showCommunityList () {
        this.communityListShowFlag = true;
      },
      toggleCommunityList () {
        this.communityListShowFlag = !this.communityListShowFlag;
      },
      topTipAuto (text) {
        this.toptipTxt = text;
        this.$refs.toptip.show();
        setTimeout(() => {
          this.$refs.toptip.hide();
        }, 2000);
      },
      confirm () {
        if (this.currentConfirmsOperate === 1) {
          this.$router.replace({
            path: '/user/login'
          });
        } else if (this.sendResult){
          this.$router.back();
        } else {
          this.$refs.upload.removeUploadFile(this.uploadInfo.remove.item, this.uploadInfo.remove.index);
        }
      },
      cancel () {
        if (this.sendResult){
          this.$router.back();
        }
      },
      send () {
        this.sendResult = false;
        if (!this.sendFlag || !this.commentFormCont.trim() || !this.userGuid) {
          if (!this.userGuid) {
            this.currentConfirmsOperate = 1;
            this.confirmTxt = '请先登录!';
            this.$refs.confirmsWrapper.show();
          }
          return false;
        }
        if (this.type === 'comment') {
          if (!this.clubName) {
            this.topTipAuto('请选择发布对象！');
            return false;
          }
        }

        var fnName = '';
        if (this.type === 'comment') {
          fnName = '_addCommentV2';
        } else {
          fnName = '_addCommentReply';
        }
        var imgHashes = '';
        if (this.uploadInfo.files.length > 0) {
          imgHashes = this.getUploadHash();
          if (!imgHashes) {
            this.topTipAuto('请上传图片！');
            return;
          }
          this.uploadInfo.imgHashes = imgHashes;
        }
        this.sendFlag = false;
        this[fnName](this.shareType).then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res);
            }
            if (this.type === 'comment') {
              this.$emit('commentUpdate');
            } else {
              this.$emit('replayUpdate');
            }
            this.sendResult = true;
            this.confirmTxt = '发布成功!';
            this.$refs.confirmsWrapper.show();
          }
        }).catch(error => {
          this.toptipTxt = error.message;
          this.$refs.toptip.show();
        }).finally(() => {
          this.sendFlag = true;
        });
      },
      _addCommentV2 (shareType) {
        var param = {
          targetId: this.clubId,
          userGuid: this.userGuid,
          content: this.commentFormCont,
          type: 4,
          version: 1,
          shareType: 1,
          imgHashes: this.uploadInfo.imgHashes
        };
        if (this.isShare) {
          param.shareType = shareType;
          param.shareFlag = 'Y';
          param.shareContent = this.shareOriginalData.id;
        }
        return addCommentV2(param);
      },
      _listMyClubs () {
        var param = {
          userGuid: this.userGuid,
          version: 1
        };
        return listMyClubs(param);
      },
      _getFileCloudToken () {
        var param = {
          userGuid: this.userGuid
        };
        return getFileCloudToken(param);
      },
      _addCommentReply () {
        var param = {
          commentId: this.$route.params.commentId,
          userGuid: this.userGuid,
          content: this.commentFormCont,
          version: 1,
          imgHashes: this.uploadInfo.imgHashes
        };
        if (this.$route.query.replyId) {
          param = Object.assign({}, param, {
            replyId: this.$route.query.replyId,
            replyUserGuid: this.$route.query.replyUserGuid
          });
        }
        return addCommentReply(param);
      }
    },
    watch: {
      courseIntro () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      courseList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      imgStatus () {
        if (this.imgStatus === 'finished') {
          this.submit();
        }
      }
    },
    components: {
      HeaderTitle,
      TopTip,
      Scroll,
      Confirm,
      Upload,
      Loading,
      ShareLink
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./commentForm";

</style>

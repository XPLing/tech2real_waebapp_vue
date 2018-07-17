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
              <div class="upload-wrapper">
                <!--<img :src="item.url" v-for="(item, index) in uploadInfo.imgs" :key="index" v-if="uploadInfo">-->
                <!--<i class="icon c-icon-upload"></i>-->
                <uploader url="https://up.qbox.me" :token="token"></uploader>
              </div>
            </div>
            <div class="bottom" v-if="favoriteClub">
              <div class="info-group text">
                <div class="input-item text" @click="toggleCommunityList">
                  <div class="name">发布到：</div>
                  <div class="cont">
                    <input :value="clubName" type="text" readonly="readonly" disabled="disabled">
                  </div>
                  <i class="icon fa fa-angle-down" :class="{'active': communityListShowFlag}"></i>
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
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { addCommentV2, addCommentReply } from 'api/info';
  import { getFileCloudToken } from 'api/upload';
  import { listMyClubs } from 'api/community';
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Confirm from 'base/confirm/confirm';

  export default {
    props: ['commentFormPlaceholder', 'type'],
    inject: ['reload'],
    data () {
      return {
        confirmTxt: '请先登录!',
        toptipTxt: '',
        pageTitle: '评论',
        commentFormCont: '',
        communityListShowFlag: false,
        favoriteClub: null,
        clubName: '',
        clubId: null,
        uploadInfo: {
          imgs: []
        },
        token: null
      };
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid',
        'userInfo'
      ]),
      ...mapState({
        imgStatus: state => state.imgstore.img_status,
        imgPaths: state => state.imgstore.img_paths
      })
    },
    created () {
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
      this._getFileCloudToken().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            this.toptipTxt = res.message;
            this.$refs.toptip.show();
            return;
          }
          this.token = res.result.token;
        }
      }, erro => {
        this.toptipTxt = erro.message;
        this.$refs.toptip.show();
      });
    },
    mounted () {
    },
    methods: {
      submit () {
        let values = [];
        for (let key of this.imgPaths) {
          values.push(key);
        }
        this.uploadInfo.imgs = values;
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
      confirm () {
        this.$router.push({
          path: '/user/login'
        });
      },
      cancel () {

      },
      send () {
        if (!this.commentFormCont.trim() || !this.clubName || !this.userGuid) {
          if (!this.userGuid) {
            this.$refs.confirmsWrapper.show();
          }
          if (!this.clubName) {
            this.toptipTxt = '请选择发布对象！';
            this.$refs.toptip.show();
            setTimeout(() => {
              this.$refs.toptip.hide();
            }, 2000);
          }
          return false;
        }
        var fnName = '';
        if (this.type === 'comment') {
          fnName = '_addCommentV2';
        } else {
          fnName = '_addCommentReply';
        }
        this[fnName]().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return;
            }
            this.$emit('update');
            this.$router.back();
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      },
      _addCommentV2 () {
        var param = {
          targetId: this.clubId,
          userGuid: this.userGuid,
          content: this.commentFormCont,
          type: 4,
          clientType: 1,
          version: 1,
          shareType: 1,
          imgHashes: this.uploadInfo.imgHash
        };
        return addCommentV2(param);
      },
      _listMyClubs () {
        var param = {
          userGuid: this.userGuid,
          version: 1,
          clientType: 1
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
          clientType: 1
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
          this.submit()
        }
      }
    },
    components: {
      HeaderTitle,
      TopTip,
      Scroll,
      Confirm
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./commentForm";

</style>

<template>
  <li class="c-info-list-item"
      :class="{'chunk':(initInfo.infoType===1 && currentTag !== tagCount && showSpecial && initInfo.isRecommend==='Y') || (showSpecial && initInfo.infoType===2)}"
      @click.stop="selectItem(initInfo)">
    <template v-if="initInfo">
      <template v-if="initInfo.infoType===1">
        <div class="wrapper recommend"
             v-if="showSpecial && initInfo.isRecommend==='Y' && currentTag !== tagCount">
          <p class="pic">
            <img v-lazy="{
            src: initInfo.drawImg || initInfo.pictureUrl,
            error: lazy.error,
            loading: lazy.loading
          }">
          </p>
          <div class="detail">
            <p class="title">{{initInfo.listTitle | ellipsis(28)}}</p>
            <p class="brief">{{initInfo.brief | ellipsis(50)}}</p>
          </div>
          <div class="info">
            <p class="left">
              <span class="source">{{ initInfo.source }}</span>
              <span class="time">{{ initInfo.createdTime.split(' ')[0]}}</span>
            </p>
            <p class="right">
              <span class="flag org">推荐</span>
            </p>
          </div>
        </div>
        <div class="wrapper c-media" v-else>
          <div class="media-body">
            <p class="title">{{initInfo.listTitle | ellipsis(28)}}</p>
            <p class="info">
              <span>{{ initInfo.source }}</span>
              <span>{{ initInfo.timeValue }}</span>
              <!--<span>{{ initInfo.createdTime.split(' ')[0]}}</span>-->
            </p>
          </div>
          <div class="media-right">
            <img v-lazy="{
          src: initInfo.drawImg || initInfo.pictureUrl,
          error: lazy.error,
          loading: lazy.loading
        }" alt="">
          </div>
        </div>
      </template>
      <template v-else>
        <div class="wrapper club" v-if="showSpecial && initInfo.infoType===2">
          <div class="titlebox green">
            <p class="title">社群推荐</p>
            <a class="more" @click.stop="toClubs">更多<i class="arrow"></i></a>
          </div>
          <clubs-list-horizontal :clubList="initInfo.list" @selectItem="selectClubItem"
                                 @join="joinClub"></clubs-list-horizontal>
        </div>
        <div class="wrapper c-media" v-else>
          <div class="media-body">
            <p class="title">{{initInfo.listTitle | ellipsis(28)}}</p>
            <p class="info">
              <span>{{ initInfo.source }}</span>
              <span>{{ new Date(initInfo.createdTime) | formatDate('yyyy-MM-dd')}}</span>
            </p>
          </div>
          <div class="media-right">
            <img v-lazy="{
                src: initInfo.pictureUrl,
                error: lazy.error,
                loading: lazy.loading
              }" alt="">
          </div>
        </div>
      </template>
    </template>
  </li>
</template>

<script type="text/ecmascript-6">
  import ClubsItem from 'base/clubs-item/clubs-item';
  import ClubsListHorizontal from 'base/clubs-list-horizontal/clubs-list-horizontal';
  import { imgOnloadSingle, changeImgRatio } from 'assets/js/imgOnload';
  import { common } from 'assets/js/util';

  const IMGBIG_W = common.calculateWH(347);
  const IMGBIG_H = common.calculateWH(200);
  const IMGSMALL_W = common.calculateWH(109);
  const IMGSMALL_H = common.calculateWH(85);
  export default {
    // type: 1.业界动态 2.关注
    props: {
      info: {
        type: Object,
        default: null
      },
      showSpecial: false,
      currentTag: {
        type: Number,
        default: 1
      },
      tagCount: null
    },
    data () {
      return {
        clubFirst: true,
        initInfo: null,
        lazy: {
          src: this.info.coverUrl,
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        }
      };
    },
    created () {
      if (this.currentTag === this.tagCount) {
        if (this.info.article) {
          this.info.article.infoType = 1;
          this.$set(this.$data, 'initInfo', this.info.article);
        } else if (this.info.club) {
          let obj = {
            list: this.info.club,
            infoType: 2
          };
          this.$set(this.$data, 'initInfo', obj);
        }
      } else {
        this.info.infoType = 1;
        this.$set(this.$data, 'initInfo', this.info);
      }
      // 图片处理
      if (this.initInfo.pictureUrl && this.initInfo.infoType === 1) {
        imgOnloadSingle(this.initInfo.pictureUrl).then(res => {
          let imgSrc, boxImg;
          if (this.showSpecial && this.initInfo.isRecommend === 'Y' && this.currentTag !== this.tagCount) {
            // 大图
            boxImg = {
              width: IMGBIG_W,
              height: IMGBIG_H
            };

          } else {
            // 小图
            boxImg = {
              width: IMGSMALL_W,
              height: IMGSMALL_H
            };
          }
          imgSrc = changeImgRatio(res, boxImg);
          this.$set(this.initInfo, 'drawImg', imgSrc);
        }).catch(e => {
          console.log(e);
        });
      }
    },
    methods: {
      toClubs () {
        this.$router.push({
          path: '/clubs'
        });
      },
      selectItem (data) {
        if (data.infoType === 2) {
          return;
        }
        this.$emit('selectInfo', data);
      },
      selectClubItem (data) {
        this.$emit('selectClubItem', data);
      },
      joinClub (data) {
        this.$emit('joinClub', data);
      }
    },
    components: {
      ClubsItem,
      ClubsListHorizontal
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./info-item";
</style>

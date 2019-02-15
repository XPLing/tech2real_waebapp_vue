<template>
  <li class="c-info-list-item" :class="{'chunk':(type===1 && showSpecial && initInfo.isRecommend==='Y') || (showSpecial && initInfo.infoType===2)}" @click.stop="selectItem(initInfo)">
    <template v-if="initInfo">
      <template v-if="type===1">
        <div class="wrapper recommend" v-if="showSpecial && initInfo.isRecommend==='Y'">
          <img v-lazy="{
            src: initInfo.pictureUrl,
            error: lazy.error,
            loading: lazy.loading
          }">
          <div class="detail">
            <p class="title">{{initInfo.listTitle | ellipsis(28)}}</p>
            <p class="brief">{{initInfo.brief | ellipsis(50)}}</p>
          </div>
          <div class="info">
            <p class="left">
              <span class="source">{{ initInfo.source }}</span>
              <span class="time">{{ new Date(initInfo.createdTime) | formatDate('yyyy-MM-dd')}}</span>
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
              <span>{{ initInfo.createdTime.split(' ')[0]}}</span>
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
      <template v-else>
        <div class="wrapper club" v-if="showSpecial && initInfo.infoType===2">
          <div class="titlebox green">
            <p class="title">社群推荐</p>
            <a class="more" @click.stop="toClubs">更多<i class="arrow"></i></a>
          </div>
          <clubs-list-horizontal :clubList="initInfo" @selectClub="selectClub"></clubs-list-horizontal>
        </div>
        <div class="wrapper c-media" v-else>
          <div class="media-body">
            <p class="title">{{initInfo.listTitle | ellipsis(28)}}</p>
            <p class="info">
              <span>{{ initInfo.author }}</span>
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

  export default {
    // type: 1.listNewsArticlesByCategory 2.listNewsArticlesByCategory
    props: {
      info: {
        type: Object,
        default: null
      },
      showSpecial: false,
      type: {
        type: Number,
        default: 1
      }
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
      if (this.type === 2) {
        if (this.info.article) {
          this.initInfo = this.info.article;
          this.$set(this.$data.initInfo, 'infoType', 1);
        } else if (this.info.club) {
          this.initInfo = this.info.club;
          this.$set(this.$data.initInfo, 'infoType', 2);
        }
      } else {
        this.initInfo = this.info;
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
      selectClub (data) {
        var url = `/clubs/clubdetail/${data.guid}`;
        this.$router.push({
          path: url,
          query: {
            first: this.clubFirst
          }
        });
        if (this.clubFirst) {
          this.clubFirst = false;
        }
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

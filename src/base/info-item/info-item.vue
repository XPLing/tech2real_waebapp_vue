<template>
  <li class="c-info-list-item" @click.stop="selectItem(initInfo)">
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
      <template v-else>
        <div class="wrapper club" v-if="showSpecial && initInfo.infoType===2">
          <div class="titlebox green">
            <p class="icon left"><span class="small"></span><span class="big"></span></p>
            <p class="title">社群推荐</p>
            <p class="icon right"><span class="big"></span><span class="small"></span></p>
            <a class="more" @click.stop="toClubs">更多社群</a>
          </div>
          <ul class="club-list">
            <clubs-item v-for="(citem, index) in initInfo" :key="index" :club="citem"
                        @selectClub="selectClub"></clubs-item>
          </ul>
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
      ClubsItem
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./info-item";
</style>

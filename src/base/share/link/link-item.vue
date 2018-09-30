<template>
  <div @click.stop="clickLink" class="c-share-link">
    <img class="cover" v-lazy="{
          src: cover,
          error: lazy.error,
          loading: lazy.loading
        }">
    <p class="title">{{title}}</p>
    <top-tip ref="toptip" :delay="10000">
      <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
    </top-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getArticleById } from 'api/info';
  import { getCourseById } from 'api/courseDetail';
  import { getActivityById } from 'api/activity';
  import TopTip from 'base/top-tip/top-tip';
  import { ERR_OK } from 'api/config';
  // shareType; //1 课程，2 资讯文章，3 活动，10 其他；
  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          src: this.cover,
          error: require('./loading.jpg'),
          loading: require('./loading.jpg')
        },
        toptipTxt: '',
        shareContent: '',
        shareUrl: '',
        cover: '',
        title: '',
        infoFirst: true,
        courseFirst: true,
        clubFirst: true,
        currentType: ''
      };
    },
    created () {
      var requestName = '', titleName = 'title', coverName = 'coverUrl', firstType = '', sourceType = '';
      this.shareContent = JSON.parse(this.data.shareContent);
      switch (this.data.shareType) {
        case 1:
          sourceType = 'course';
          requestName = '_getCourseById';
          firstType = 'infoFirst';
          this.shareUrl = `/train/all/${this.shareContent}`;
          break;
        case 2:
          sourceType = 'article';
          requestName = '_getArticleById';
          titleName = 'listTitle';
          coverName = 'pictureUrl';
          firstType = 'courseFirst';
          this.shareUrl = `/info/infodetail/${this.shareContent}`;
          break;
        case 3:
          sourceType = 'activity';
          firstType = 'clubFirst';
          requestName = '_getActivityById';
          this.shareUrl = `/activity/detail/${this.shareContent}`;
          break;
        case 10:
          this.shareUrl = this.shareContent.link_url;
          break;
      }
      if (this.data.shareType === 10) {
        this.cover = this.shareContent.link_cover;
        this.title = this.shareContent.link_title;
      } else {
        this.currentType = firstType;
        this[requestName]().then((res) => {
          this.likeFlag = false;
          if (res.code) {
            if (res.code != ERR_OK) {
              this.toptipTxt = res.message;
              this.$refs.toptip.show();
              return false;
            }
            this.cover = res.result[coverName];
            this.title = res.result[titleName];
          }
        }, erro => {
          this.toptipTxt = erro.message;
          this.$refs.toptip.show();
        });
      }

    },
    methods: {
      clickLink () {
        if (this.data.shareType === 10) {
          window.open(this.shareUrl);
        } else {
          this.$router.push(
            {
              path: this.shareUrl,
              query: {
                first: this[this.currentType]
              }
            }
          );
          if (this[this.currentType]) {
            this[this.currentType] = false;
          }
        }
      },
      _getArticleById () {
        var param = {
          article_id: parseInt(this.data.shareContent),
          user_guid: this.data.userGuid
        };
        return getArticleById(param);
      },
      _getCourseById () {
        var param = {
          id: parseInt(this.data.shareContent),
          userGuid: this.data.userGuid
        };
        return getCourseById(param);
      },
      _getActivityById () {
        var param = {
          id: parseInt(this.data.shareContent),
          userGuid: this.data.userGuid
        };
        return getActivityById(param);
      }
    },
    components: {
      TopTip
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./link-item";
</style>

<template>
  <transition name="slide">
    <div class="g-ticket">
      <header class="g-header">
        <HeaderTitle :title="pageTitle" :has-back="true"></HeaderTitle>
      </header>
      <div class="g-main">
        <scroll :data="ticketList" ref="scroll" :pullup="true" :probeType="probeType"
                :listenScroll="listenScroll" @pullingUp="requestTicket">
          <div>
            <div class="ticket-wrapper" v-if="ticketList">
              <ticket-list :data="ticketList" @goBuy="goBuy"></ticket-list>
            </div>
            <div class="no-result" v-show="!ticketList">
              <no-result :title="'没有找到您要的内容'"></no-result>
            </div>
            <p v-show="ticketList && (requestMoreFlag || noMore)" class="request-result">
              {{noMore ? noMoreStr : noResult}}</p>
            <back-top ref="backTop" @backTop="backTop"></back-top>
          </div>
        </scroll>
      </div>
      <router-view></router-view>
      <top-tip ref="toptip" :delay="10000">
        <p class="error" v-show="toptipTxt" v-html="toptipTxt"></p>
      </top-tip>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import Scroll from 'base/scroll/scroll';
  import HeaderTitle from 'components/header-title/header-title';
  import { ERR_OK } from 'api/config';
  import * as util from 'assets/js/util';
  import { mapGetters, mapMutations } from 'vuex';
  import TopTip from 'base/top-tip/top-tip';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import { listTickets } from 'api/ticket';
  import BackTop from 'base/backtop/backtop';
  import { imgOnload } from 'assets/js/imgOnload';
  import TicketList from 'base/ticket-list/ticket-list';

  export default {
    props: {
      activity: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        toptipTxt: '',
        pageTitle: '门票',
        articleInfo: null,
        probeType: 2,
        listenScroll: true,
        recommendList: null,
        ticketList: null,
        requestMoreFlag: false,
        noMore: false,
        noResult: '加载中。。。',
        noMoreStr: '没有更多了~',
        requestPage: 1
      };
    },
    created () {
      this.id = this.$route.params.id;
      this.requestTicket();
    },
    computed: {
      ...mapGetters([
        'productGuid',
        'userGuid'
      ])
    },
    methods: {
      goBuy (data) {
        if (this.activity.needInfo) {
          this.$router.push({
            path: `/activity/list/detail/${this.id}/commentlist/${data.id}`
          });
        }

      },
      requestTicket () {
        if (this.noMore) {
          return;
        }
        if (!this.requestMoreFlag) {
          this.requestMoreFlag = true;
          this._listTickets(this.requestPage).then((res) => {
            this.$refs.scroll.finishPullUp();
            this.requestMoreFlag = false;
            if (res.code) {
              if (res.code != ERR_OK) {
                this.toptipTxt = res.message;
                this.$refs.toptip.show();
                return;
              }
              if (res.result.length > 0) {
                if (this.ticketList) {
                  this.ticketList = this.ticketList.concat(res.result);
                } else {
                  this.ticketList = res.result;
                }
                this.requestPage = this.requestPage + 1;
              } else {
                this.noMore = true;
                this.$refs.scroll.closePullUp();
                this.$nextTick(() => {
                  this.$refs.scroll.refresh();
                });
              }
            }
          }, erro => {
            this.$refs.scroll.finishPullUp();
            this.toptipTxt = erro.message;
            this.$refs.toptip.show();
          });
        }
      },
      backTop () {
        this.$refs.scroll.scrollTo(0, 0, 300);
      },
      _listTickets (page) {
        var param = {
          page: page,
          type: 1,
          userGuid: this.userGuid,
          id: this.id
        };
        return listTickets(param);
      }
    },
    watch: {
      ticketList () {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
    components: {
      HeaderTitle,
      swiper,
      swiperSlide,
      TopTip,
      Loading,
      Scroll,
      BackTop,
      NoResult,
      TicketList
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./ticketList";

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>

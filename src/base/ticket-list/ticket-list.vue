<template>
  <ul class="c-ticket-list">
    <ticket-item :data="item" v-for="(item, index) in data" :key="index"
                    @selectTicket="selectTicket" @goBuy="goBuy"></ticket-item>
  </ul>
</template>

<script type="text/ecmascript-6">
  import TicketItem from 'base/ticket-item/ticket-item';

  export default {
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    data () {
      return { };
    },
    created () {
    },
    methods: {
      selectTicket (data) {
        this.$emit('selectTicket', data);
      },
      goBuy (data) {
        this.$emit('goBuy', data);
      }
    },
    components: {
      TicketItem
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./ticket-list";
</style>

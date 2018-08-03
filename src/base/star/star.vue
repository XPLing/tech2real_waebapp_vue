<template>
    <div :class="['g-star',starType]">
        <span v-for="(item, index) in itemClassese" :class="['star-item',item]" :key="index" @click="clickStar($event, index)"></span>
    </div>
</template>

<script type="text/ecmascript-6">
    const LENGTH = 5;
    const CLS_ON = "on";
    const CLS_OFF = "off";
    const CLS_HALF = "half";
    export default{
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number
            }
        },
        computed: {
            starType(){
                return "star-" + this.size;
            },
            itemClassese(){
                var intScore = Math.floor(this.score * 2) / 2,
                    hasDecimal = intScore % 1 !== 0,
                    arr = [];
                var integer = Math.floor(intScore);

                for (var i = 0; i < LENGTH; i++) {

                    if (i < integer) {
                        arr.push(CLS_ON);
                    } else {
                        if (i == integer && hasDecimal) {
                            arr.push(CLS_HALF);
                        } else {
                            arr.push(CLS_OFF);
                        }
                    }
                }
                return arr;
            }
        },
        data(){
            return {}
        },
        created(){

        },
        methods: {
          clickStar(e, index){
            this.$emit('clickStar', e, index);
          }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
    @import "./style/star";
</style>

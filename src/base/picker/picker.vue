<template>
  <div class="g-select" v-show="showFlag">
    <div class="mask" @click.stop="clickMask"></div>
    <div class="fix-wrapper">
      <transition-group tag="div" name="drop-down">
        <div class="chunk control-bar" v-show="showFlag" :key="'controlBar'">
          <p class="item cancel" @click="cancel">取消</p>
          <p class="item confirm" @click="confirm">确定</p>
        </div>
        <div class="chunk titlebox" v-show="showFlag" :key="'titlebox'">
          <p class="item">省</p>
          <p class="item">市</p>
        </div>
        <div class="chunk g-select-box" v-show="showFlag" :key="'selectbox'">
          <div class="scroll-group">
            <scroll class="scroll-item provinces" :freeScroll="true" :data="{provincesData}" ref="scroll">
              <div class="g-select-wrapper">
                <ul class="g-form-select" v-show="showFlag">
                  <li class="item" :class="{'on': index==currentProvincesSelect}" v-for="(item, index) in provincesData"
                      :key="index"
                      @click.stop="selectProvincesItem(item,index)">
                    {{item.name}}
                  </li>
                </ul>
              </div>
            </scroll>
            <scroll class="scroll-item city" :data="{cityData}" ref="scroll">
              <div class="g-select-wrapper">
                <ul class="g-form-select" v-show="showFlag">
                  <li class="item" :class="{'on': index==currentCitySelect}" v-for="(item, index) in cityData"
                      :key="index"
                      @click.stop="selectCityItem(item,index)">
                    {{item.name}}
                  </li>
                </ul>
              </div>
            </scroll>
          </div>

          <loading ref="loading" :is-local="true" :type="'simple'"></loading>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import { getProvinces, getCities } from 'api/address';
  import Loading from 'base/loading/loading';
  import { ERR_OK, ERR_OK_STR } from 'api/config';

  export default {
    props: {
      initProvincesSelect: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        loadingDate: false,
        showFlag: false,
        provinceCode: '',
        provincesData: null,
        cityData: null,
        province: '',
        city: '',
        currentCitySelect: -1,
        currentProvincesSelect: -1
      };
    },
    created () {
      this.currentProvincesSelect = this.initProvincesSelect || this.currentProvincesSelect;
      this._getProvinces().then((res) => {
        if (res.code) {
          if (res.code != ERR_OK) {
            return Promise.reject(res.result);
          }
          this.provincesData = res.result;
        }
      }).catch(e => {
        this.$emit('error', e);
      });
    },
    methods: {
      show () {
        this.showFlag = true;
      },
      hide () {
        this.showFlag = false;
      },
      cancel(){
        this.hide();
        this.$emit('cancel');
      },
      confirm(){
        this.hide();
        this.$emit('confirm', {
          province: this.province,
          city: this.city
        });
      },
      selectProvincesItem (item, index) {
        this.provinceCode = item.code;
        this.currentProvincesSelect = index;
        this.province = item.name;
        this.$emit('selectProvincesItem', item, index);
        this.$refs.loading.show();
        this._getCities().then((res) => {
          if (res.code) {
            if (res.code != ERR_OK) {
              return Promise.reject(res.result);
            }
            this.cityData = res.result;
          }
        }).catch(e => {
          this.$emit('error', e);
        }).finally(res => {
          this.$refs.loading.hide();
        });
        // this.hide();
      },
      selectCityItem (item, index) {
        this.currentCitySelect = index;
        this.city = item.name;
        this.$emit('selectCityItem', item, index);
      },
      clickMask () {
        this.hide();
        this.$emit('clickMask');
      },
      _getProvinces (data) {
        var param = {
          user_guid: this.userGuid,
          product_guid: this.productGuid
        };
        return getProvinces(param);
      },
      _getCities (data) {
        var param = {
          user_guid: this.userGuid,
          product_guid: this.productGuid,
          province_code: this.provinceCode
        };
        return getCities(param);
      }
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "./picker";
</style>

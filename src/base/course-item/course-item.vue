<template>
  <li class="c-course-list-item" @click.stop="selectItem(course)">
    <div class="media-left">
      <img v-lazy="{
          src: course.coverUrl,
          error: lazy.error,
          loading: lazy.loading
        }" />
    </div>
    <div class="media-body">
      <p class="title">{{course.title}}</p>
      <!--:class="course.price===0?'green':'red'"-->
      <p class="info">
        <span class="price">{{course.price === 0 ? '免费' : `￥${course.price}`}}</span>
        <span class="apply"> <i class="icon c-icon-avatar"></i><em>{{course.applyCount}}</em></span>
      </p>
    </div>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      course: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        lazy: {
          src: this.course.coverUrl,
          error: require('./course-loading.jpg'),
          loading: require('./course-loading.jpg')
        }
      };
    },
    created () {
    },
    methods: {
      selectItem (course) {
        this.$emit('selectcourse', course);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "course-item";
</style>

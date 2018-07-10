<template>
  <div class="g-course-list">
    <ul class="list" v-if="courseList" v-for="(course, index) in courseList" :key="index">
      <li class="c-course-list c-media" @click.stop="selectItem(course.id)">
        <div class="media-left">
          <img :src="course.coverUrl" alt="">
        </div>
        <div class="media-body">
          <p class="title">{{course.title}}</p>
          <p class="info"><span class="price"
                                :class="course.price===0?'green':'red'">{{course.price === 0 ? '免费' : `￥${course.price}`}}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      courseList: {
        type: Array,
        default: null
      }
    },
    methods: {
      selectItem (id) {
        this.$emit('selectcourse', id);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss">
  @import "~assets/scss/compile";
  @import "course-list";
</style>

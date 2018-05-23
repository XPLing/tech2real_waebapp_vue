<template>
  <li class="c-course-list-item c-media" @click.stop="selectItem(course)">
    <div class="media-left">
      <img :src="course.coverUrl" alt="">
    </div>
    <div class="media-body">
      <p class="title">{{course.title}}</p>
      <p class="info"><span class="price"
                            :class="course.price===0?'green':'red'">{{course.price === 0 ? '免费' : course.price}}</span>
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

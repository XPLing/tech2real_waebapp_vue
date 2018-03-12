<template>
  <div id="app">
    <g-header></g-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header';

  export default {
    name: 'App',
    components: {
      'g-header': MHeader
    }
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    transition: all .3s;
  }
</style>

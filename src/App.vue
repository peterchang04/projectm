<template>
  <div id="app">
    <TestOutput msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
  import TestOutput from './components/TestOutput.vue'

  export default {
    name: 'app',
    components: { TestOutput }
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
  }
</style>

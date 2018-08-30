<!-- This is the main landing component -->
<template>
  <div id="app">
    <TestOutput msg="Welcome. This is the Layout "/>

    <!-- <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/a">Page A</router-link>
      <router-link to="/b">Page B</router-link>
    </nav> -->

    <router-view />
  </div>
</template>

<script>
  import TestOutput from './components/TestOutput.vue';

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

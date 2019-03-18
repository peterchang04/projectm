<!-- This is the main landing component -->
<template>
  <div id="app">
    <!-- <TestOutput msg="Welcome. This is the Layout "/> -->
    <nav>
      <!-- <router-link to="/">Home</router-link> -->
      <router-link v-if="$route.path !== '/pilot'" id="pilotLink" to="/pilot">TO PILOT</router-link>
    </nav>

    <div id="viewport">
      <router-view />
    </div>

    <!-- assets are here to be loaded first -->
    <Assets />

  </div>
</template>

<script>
  import Assets from './components/Assets.vue';

  export default {
    name: 'app',
    components: { Assets },
    afterCreate: function () {
      console.log(this.pathname);
    },
  };
</script>

<style>
  * {
    vertical-align: top;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Fira Sans Extra Condensed', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    text-align: center;
    color: #2c3e50;
    background-color: #001000;
    height: 100%;
    width: 100%;
  }
  #pilotLink {
    position: fixed;
    top: 10px;
    left: 10px;
  }
  #viewport {
    margin: auto;
    height: 100%;
    width: 100%;
    background-color: #0c171f;
    /* max-width: 480px;
    max-height: 853px; */
  }
</style>

<!-- This is the main landing component -->
<template>
  <div id="app">
    <!-- <TestOutput msg="Welcome. This is the Layout "/> -->
    <nav>
    </nav>

    <div id="viewport">
      <router-view />
    </div>

    <!-- assets are here to be loaded first -->
    <Assets />
  </div>
</template>

<script>
  import Assets from './Assets.vue';
  import eventManager from '../utils/eventManager.js';

  export default {
    name: 'app',
    components: { Assets },
    created: function () {
      document.eventManager = eventManager;
    },
    methods: {
    }
  };
</script>

<style>
  * {
    vertical-align: top;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
  }
  body {
    margin: 0;
    padding: 0;
    touch-action: none;
  }
  svg {
    width: 6vw;
    height: 6vw;
  }
  #app {
    font-family: 'Fira Sans Extra Condensed', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #001000;
    height: 100%;
    width: 100%;
    /* MOCK-FULLSCREEN */
    position: fixed; /* this allows the body to scroll, hiding url bar and bottom bar on some mobile devices */
    z-index: 1; /* overridden by javascript after user initiated scroll event */
    overscroll-behavior: none;
    touch-action: pan-down;
  }
  #viewport {
    margin: auto;
    height: 100%;
    width: 100%;
    background-color: #0c171f;
    /* max-width: 480px;
    max-height: 853px; */
  }
  #fullscreenButton {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 9999; /* needs updating. see zindex.txt */
  }
  /* global styles for all panels and controls */
  .panelGrid {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(12, 8.3%);
    background-color: #21292f;
  }
  .panelGrid > div {
    height: 100%;
    width: 100%;
  }

  /* standard animation effects */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>

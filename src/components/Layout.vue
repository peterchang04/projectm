<!-- This is the main landing component -->
<template>
  <div id="app">
    <Assets />
    <router-view />
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
    },
    mounted() {
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
  input, input:before, input:after {
    user-select: initial; /* this is to offset user-select: none in * {} */
  }
  body {
    margin: 0;
    padding: 0;
    touch-action: none;
  }
  body, html {
    position: fixed;
    margin: 0;
  }
  svg {
    width: 6vw;
    height: 6vw;
  }
  #app {
    font-family: 'Fira Sans Extra Condensed';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #131315;
    height: 100%;
    width: 100%;
    /* MOCK-FULLSCREEN */
    position: fixed; /* this allows the body to scroll, hiding url bar and bottom bar on some mobile devices */
    z-index: 1; /* overridden by javascript after user initiated scroll event */
  }
  #displayDiv{
    position: absolute;
    /* see media queries for positioning */
  }
  button {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  /* touchscreen device buttons shouldn't have cursor pointer */
  @media (hover: hover) {
    button {
      cursor: pointer;
    }
  }

  /* standard animation effects */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .pannable {
    transition: transform 0.8s ease-in-out, opacity 0.8s ease-out;
  }
  .pannedRight {
    transform: translate3d(100vw, 0, 0);
    opacity: 0.2;
  }
  .pannedLeft {
    transform: translate3d(-100vw, 0, 0);
    opacity: 0.2;
  }
  .unpanned {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
</style>

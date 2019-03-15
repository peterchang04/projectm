<template>
  <div id="shipView">
    <!-- actors -->
    <canvas id="canvas_myShip"></canvas>
    <canvas id="canvas_ships"></canvas>
    <canvas id="canvas_bullets"></canvas>
    <!-- parallax stuff -->
    <canvas id="canvas_foreground"></canvas>
    <canvas id="canvas_background"></canvas>
  </div>
</template>

<script>
  import Main from '../game/main.js';

  export default {
    name: 'shipView',
    props: {
      msg: String
    },
    mounted: function () {
      Main.init();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #shipView {
    position: relative;
    z-index: 1000;
    background-color: black;
    flex-grow: 1;
    margin-top: -100px; /* temporary to create illution of shipview behind targetsBar */
  }
  canvas {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
</style>

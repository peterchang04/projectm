<template>
  <div id="shipView">
    <!-- BOTTOM LAYER -->
    <canvas id="canvas_grid"></canvas>
    <canvas id="canvas_background"></canvas>
    <!-- actors -->
    <canvas id="canvas_myShip">
    </canvas>
    <canvas id="canvas_ships"></canvas>
    <canvas id="canvas_bullets"></canvas>
    <!-- parallax stuff -->
    <!-- <canvas id="canvas_foreground"></canvas> -->
    <canvas id="canvas_listener"></canvas>
    <!-- TOP LAYER -->
    <PilotSteering v-if="$route.path == '/pilot'"/>
  </div>
</template>

<script>
  import Main from '../game/main.js';
  import PilotSteering from './controls/PilotSteering.vue';

  export default {
    components: { PilotSteering },
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
  }
  canvas {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
  #canvas_myShip {
    height: auto;
    width: 30%;
    left: 35%;
    right: 35%;
    top: auto;
    bottom: 17%;
    transform: scale(.3);
  }
</style>

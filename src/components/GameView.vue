<template>
  <div id="shipView">
    <!-- BOTTOM LAYER -->
    <canvas id="canvas_stars"></canvas>
    <canvas id="canvas_grid"></canvas>
    <canvas id="canvas_background"></canvas>
    <!-- actors -->
    <canvas id="canvas_actors"></canvas>
    <canvas id="canvas_projectiles"></canvas>
    <canvas id="canvas_particles"></canvas>
    <!-- parallax stuff -->
    <!-- <canvas id="canvas_foreground"></canvas> -->
    <canvas id="canvas_listener"></canvas>
    <!-- TOP LAYER -->
    <PilotSteering :class="{ hide: currentRole !== 2 }" />
  </div>
</template>

<script>
  import Main from '../game/main.js';
  import PilotSteering from './controls/PilotSteering.vue';

  export default {
    components: { PilotSteering },
    mounted: function () {
      Main.init();
    },
    computed: {
      currentRole() {
        return this.$store.state.currentRole;
      },
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
  .hide {
    z-index: -1;
    visibility: hidden;
  }
</style>

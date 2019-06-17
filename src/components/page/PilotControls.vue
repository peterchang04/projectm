<template>
  <div id="controls" class="proportionateHeightWrapper">
    <div class="content">
      <div class="forwardThrustDiv">
        <Slider
          title="Forward Thrust"
          :initialPercent="0"
          v-on:update="updateThrust"
        />
      </div>
      <div class="angularThrustDiv">
        <Slider
          title="Angular Thrust"
          :initialPercent="0"
          v-on:update="updateAngular"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Slider from '../controls/Slider.vue';
  import shipCanvas from '../../game/canvas/shipCanvas.js';
  import $g from '../../utils/globals.js';

  export default {
    name: 'pilotControls',
    components: { Slider },
    props: {
      msg: String
    },

    mounted: function() {
    },
    methods: {
      updateThrust(value) {
        $g.game.myShip.a = 3 * (value / 100);
        $g.game.myShip.sMax = 20 * (value / 100);
      },
      updateAngular(value) {
        $g.game.myShip.aSMax = 20 * (value / 100);
        if ($g.game.myShip.aSMax === 0) $g.game.myShip.aSMax = 1; // minimum aSMax
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* START This allows even height / width ratios across viewports */
  .proportionateHeightWrapper { position: relative; width: 100%; }
  .proportionateHeightWrapper:before{ content: ""; display: block;
  	padding-top: 74%; /* HEIGHT PROPORTION TO WIDTH */
  }
  .content {
    z-index: 1000; position:  absolute;
  	top: 0;  	left: 0; bottom: 0;	right: 0;
    padding: 2vw;
    text-align: left;
  }
  /* END This allows for proportionate height / width ratio across viewports */

  .forwardThrustDiv {
    position: absolute;
    left: 0px;
    top: 0px;
    padding: 2vw;
  }

  .angularThrustDiv {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 2vw;
  }
</style>

<template>
  <div class="proportionateHeightWrapper">
    <div id="pilotPanel" class="panelGrid" :style="borderStyle">
      <Heading text="Left Tube" :gridColumnStart="2" :gridColumns="5" />
      <Heading text="Right Tube" :gridColumnStart="6" :gridColumns="3" :gridRows="1" />
      <SliderVertical
        title="thrust"
        :statusFunction="statusFunction"
        :gridColumnStart="8"
        :gridColumns="1"
        :gridRowStart="1"
        :gridRows="11"
        v-on:update="updateThrust"
      />

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
  import SliderVertical from './SliderVertical.vue';
  import Heading from './Heading.vue';
  import $g from '../../utils/globals.js';
  import def from '../../definitions';

  export default {
    name: 'pilotPanel',
    components: { SliderVertical, Slider, Heading },
    props: {
      msg: String
    },
    data() {
      return {
        statusFunction: (value) => { return `${value} %` },
      };
    },
    computed: {
      borderStyle() {
        return `border-color:${def.roles[2].bgColor}`;
      }
    },
    methods: {
      updateThrust(value) {
        $g.game.myShip.thrustValue = value;
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
  .proportionateHeightWrapper {
    position: relative;
    width: 100%;
    height: 74vw; /* HEIGHT PROPORTION TO WIDTH */
  }
  .proportionateHeightWrapper:before{
    content: "";
    display: block;
    /* padding-top: 74%; */ /* HEIGHT PROPORTION TO WIDTH - note: it apperas height 74vw is working */
  }
  #pilotPanel {
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: left;
    border-right: 1vw solid transparent;
    border-bottom: 1vw solid transparent;
    border-left: 1vw solid transparent;
  }
  /* END This allows for proportionate height / width ratio across viewports */

  .forwardThrustDiv {
    position: absolute;
    top: 0px;
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
  }

  .angularThrustDiv {
    position: absolute;
    top: 0px;
    grid-column-start: 5;
    grid-column-end: 8;
    grid-row-start: 2;
    grid-row-end: 3;
  }
</style>

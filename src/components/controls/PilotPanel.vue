<template>
  <div class="proportionateHeightWrapper">
    <div id="pilotPanel" class="panelGrid" :style="borderStyle">
      <Heading text="Left Tube" :gridColumnStart="2" :gridColumns="5" />
      <Heading text="Right Tube" :gridColumnStart="6" :gridColumns="3" :gridRows="1" />
      <SliderVertical
        title="thrust"
        :initialValue="getGameThrustValue"
        :statusFunction="statusFunction"
        :gridColumnStart="8"
        :gridColumns="1"
        :gridRowStart="1"
        :gridRows="11"
        :maxValue="100"
        :minValue="-50"
        :deadZone="25"
        v-on:update="updateThrust"
      />

      <button v-on:click="fireProjectile()" id="testButton">Gun</button>

      <button v-on:click="fireProjectile2()" id="testButton2">Laser</button>

      <div class="angularThrustDiv">
        <Slider
          title="Angular Thrust"
          :initialPercent="0"
          v-on:update="updateAngular"
        />
      </div>

      <div class="console">{{getConsole}}</div>
    </div>
  </div>
</template>

<script>
  import Slider from '../controls/Slider.vue';
  import SliderVertical from './SliderVertical.vue';
  import Heading from './Heading.vue';
  import $g from '../../utils/globals.js';
  import { mapState } from 'vuex';
  import def from '../../definitions';

  export default {
    name: 'pilotPanel',
    components: { SliderVertical, Slider, Heading },
    props: {
      msg: String,
    },
    data() {
      return {
        statusFunction: (value) => { return `${value} %` },
      };
    },

    computed: {
      ...mapState(['console']),
      getConsole() {
        return this.console;
      },
      getGameThrustValue() {
        return $g.game.myShip.thrustValue;
      },
      borderStyle() {
        return `border-color:${def.roles[2].bgColor}`;
      }
    },
    methods: {
      updateThrust(value) {
        $g.game.myShip.thrustValue = value;
      },
      updateAngular(value) {
        $g.game.myShip.aSMax = $g.game.myShip.aSMaxShip * (value / 100);
        // min aSMax is 10% of capacity
        if ($g.game.myShip.aSMax < $g.game.myShip.aSMaxShip / 10) $g.game.myShip.aSMax = $g.game.myShip.aSMaxShip / 10;
      },
      fireProjectile() {
        $g.game.myShip.fireCannon();
      },
      fireProjectile2() {
        $g.game.myShip.fireTurrets();
      }
    },
    mounted() {

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

  .angularThrustDiv {
    position: absolute;
    top: 0px;
    grid-column-start: 3;
    grid-column-end: 6;
    grid-row-start: 11;
    grid-row-end: 12;
  }

  #testButton {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
  }

  #testButton2 {
    grid-column-start: 6;
    grid-column-end: 7;
    grid-row-start: 2;
    grid-row-end: 3;
  }

  .console {
    background-color: white;
    grid-column-start: 1;
    grid-column-end: 8;
    grid-row-start: 3;
    grid-row-end: 9;
  }
</style>

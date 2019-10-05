<template>
  <div id="pilotPanelRight" class="rightPanel">
    <div class="panelGrid">
      <Heading text="Right Tube" :gridColumnStart="2" :gridColumns="2" />

      <SliderVertical
        title="thrust"
        :initialValue="getGameThrustValue"
        :statusFunction="statusFunction"
        :gridColumnStart="4"
        :gridColumns="1"
        :gridRowStart="1"
        :gridRows="11"
        :maxValue="100"
        :minValue="-50"
        :deadZone="25"
        v-on:update="updateThrust"
      />

      <button v-on:click="fireProjectile2()" id="testButton2">Laser</button>

      <button v-on:click="fireProjectile4()" id="testButton4">right tube</button>
    </div>
  </div>
</template>

<script>
  import Slider from '../controls/Slider.vue';
  import SliderVertical from './SliderVertical.vue';
  import Heading from './Heading.vue';
  import $g from '../../utils/globals.js';
  import { mapState } from 'vuex';
  import { roles } from '../../definitions';

  export default {
    name: 'pilotPanelRight',
    components: { SliderVertical, Heading },
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
    },
    methods: {
      updateThrust(value) {
        $g.game.myShip.thrustValue = value;
      },
      fireProjectile2() {
        $g.game.myShip.fireTurrets();
      },
      fireProjectile4() {
        $g.game.myShip.fireTorpedo(1);
      }
    },
    mounted() {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #pilotPanelRight {
    text-align: left;
  }

  #testButton2 {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
  }

  #testButton4 {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 4;
    grid-row-end: 5;
  }

  .console {
    background-color: white;
    grid-column-start: 1;
    grid-column-end: 8;
    grid-row-start: 4;
    grid-row-end: 9;
  }
</style>

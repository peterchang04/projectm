<template>
  <div id="pilotPanel" class="leftPanel">
    <div class="panelGrid">
      <Heading text="Left Tube" :gridColumnStart="2" :gridColumns="2" />

      <button v-on:click="fireProjectile()" id="testButton">Gun</button>

      <button v-on:click="fireProjectile3()" id="testButton3">left tube</button>
    </div>
  </div>
</template>

<script>
  import Heading from './Heading.vue';
  import $g from '../../utils/globals.js';
  import { mapState } from 'vuex';
  import { roles } from '../../definitions';

  export default {
    name: 'pilotPanel',
    components: { Heading },
    props: {
      msg: String,
    },
    data() {
      return {
      };
    },
    computed: {
      ...mapState(['console']),
      getConsole() {
        return this.console;
      },

    },
    methods: {
      fireProjectile() {
        $g.game.myShip.fireCannon();
      },
      fireProjectile3() {
        $g.game.myShip.fireTorpedo();
      },
    },
    mounted() {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #pilotPanel {
    text-align: left;
  }

  #testButton {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
  }

  #testButton3 {
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

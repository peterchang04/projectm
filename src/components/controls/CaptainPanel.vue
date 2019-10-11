<template>
  <div id="captainPanel" class="leftPanel">
    <div class="panelGrid">
      <Heading text="Cap'n Panel" :gridColumnStart="1" :gridColumns="3" />

      <button v-on:click="toggleCollision" id="toggleCollision">Collision</button>

      <button v-on:click="gohome" id="goHome">home</button>

    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import { roles } from '../../definitions';
  import Heading from './Heading.vue';

  export default {
    name: 'captainPanel',
    components: { Heading },
    mounted: function() {
    },
    computed: {
    },
    methods: {
      gohome() {
        this.$router.push('/');
      },
      toggleCollision() {
        $g.constants.DRAWCOLLISION = !$g.constants.DRAWCOLLISION;
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #captainPanel {
    text-align: left;
  }
  #toggleCollision {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 11;
    grid-row-end: 12;
    width: 100%;
  }
  #goHome {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 10;
    grid-row-end: 11;
    width: 100%;
  }
</style>

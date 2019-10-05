<template>
  <div id="captainPanelRight" class="rightPanel" >
    <div class="panelGrid">
      <Heading text="Cap'n Panel" :gridColumnStart="1" :gridColumns="3" />

      <button v-on:click="reload" id="reload">reload</button>
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import { roles } from '../../definitions';
  import Heading from './Heading.vue';

  export default {
    name: 'captainPanelRight',
    components: { Heading },
    mounted: function() {
    },
    computed: {
    },
    methods: {
      reload() {
        location.reload(true);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #captainPanel {
    text-align: left;
  }
  /* END This allows for proportionate height / width ratio across viewports */
  #reload {
    grid-column-start: 4;
    grid-column-end: 5;
    grid-row-start: 11;
    grid-row-end: 12;
    width: 100%;
  }
</style>

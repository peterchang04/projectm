<template>
  <div class="proportionateHeightWrapper">
    <div id="captainPanel" class="panelGrid" :style="borderStyle">
      <Heading text="Cap'n Panel" :gridColumnStart="1" :gridColumns="3" />
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import def from '../../definitions';
  import Heading from './Heading.vue';

  export default {
    name: 'captainPanel',
    components: { Heading },
    mounted: function() {
    },
    computed: {
      borderStyle() {
        return `border-color:${def.roles[1].bgColor}`;
      }
    },
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
  #captainPanel {
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
</style>

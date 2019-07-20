<template>
  <div class="proportionateHeightWrapper">
    <div id="engineerPanel" class="panelGrid" :style="borderStyle">
      <Heading text="Hull" :gridColumnStart="1" :gridColumns="5" />
      <Heading text="Energy Use" :gridColumnStart="6" :gridColumns="3" :gridRows="1" />
      <SliderVertical :gridColumnStart="1" :gridColumns="1" :gridRowStart="2" :gridRows="10" />
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import def from '../../definitions';
  import Heading from './Heading.vue';
  import SliderVertical from './SliderVertical.vue';

  export default {
    name: 'engineerControls',
    components: { Heading, SliderVertical },
    computed: {
      borderStyle() {
        return `border-color:${def.roles[0].bgColor}`;
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
  #engineerPanel {
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

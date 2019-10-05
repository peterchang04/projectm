<template>
    <div id="engineerPanelRight" class="rightPanel">
      <div class="panelGrid">
        <Heading text="Energy Use" :gridColumnStart="1" :gridColumns="3" :gridRows="1" />
        <SliderVertical :gridColumnStart="1" :gridColumns="1" :gridRowStart="2" :gridRows="10" />
      </div>
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import { roles } from '../../definitions';
  import Heading from './Heading.vue';
  import SliderVertical from './SliderVertical.vue';

  export default {
    name: 'engineerPanelRight',
    components: { Heading, SliderVertical },
    computed: {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #engineerPanelRight {
    text-align: left;
  }
  /* END This allows for proportionate height / width ratio across viewports */
</style>

<template>
  <div id="intelPanel" class="rightPanel">
    <div class="panelGrid">
      <Heading text="Targets" :gridColumnStart="1" :gridColumns="3" />
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import { roles } from '../../definitions';
  import Heading from './Heading.vue';

  export default {
    name: 'intelPanelRight',
    components: { Heading },
    computed: {

    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #intelPanel {
    text-align: left;
  }
</style>

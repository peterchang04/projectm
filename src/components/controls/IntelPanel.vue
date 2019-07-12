<template>
  <div id="controls" class="proportionateHeightWrapper">
    <div class="content">
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';

  export default {
    name: 'intelControls',
    components: { },
    mounted: function() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* START This allows even height / width ratios across viewports */
  .proportionateHeightWrapper { position: relative; width: 100%; }
  .proportionateHeightWrapper:before{
    content: "";
    display: block;
    padding-top: 74%; /* HEIGHT PROPORTION TO WIDTH */
  }
  .content {
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 2vw;
    text-align: left;
  }
  /* END This allows for proportionate height / width ratio across viewports */
</style>

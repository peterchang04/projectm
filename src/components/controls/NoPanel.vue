<template>
  <div class="content">
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';

  export default {
    name: 'noControls',
    components: { },
    mounted: function() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content {
    position: relative;
    height: 0;
    text-align: left;
  }
  /* END This allows for proportionate height / width ratio across viewports */
</style>

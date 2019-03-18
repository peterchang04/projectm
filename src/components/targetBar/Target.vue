<template>
  <div class="target" v-bind:class="{ hasTarget: Boolean(callsign), lastTarget: index === 3 }">
  </div>
</template>

<script>
  export default {
    name: 'target',
    props: {
      callsign: String,
      index: Number
    },
    beforeCreate: function() {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .target {
    border-right: 2px dashed rgba(255, 255, 255, 0.1);
    border-bottom: 2px dashed rgba(255, 255, 255, 0.1);
  }
  .hasTarget {
    border-right: 2px solid rgba(255, 255, 255, 0.1);
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    background-color: #060606;
  }
  .lastTarget {
    border-right: none;
  }
</style>

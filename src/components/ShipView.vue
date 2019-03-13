<template>
  <div id="shipView">SHIPVIEW</div>
</template>

<script>
  export default {
    name: 'shipView',
    props: {
      msg: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #shipView {
    z-index: 1000;
    background-color: black;
    flex-grow: 1;
    margin-top: -100px; /* temporary to create illution of shipview behind targetsBar */
  }
</style>

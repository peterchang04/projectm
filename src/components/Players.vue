<template>
  <div id="players">
    <div class="player">

    </div>
    <div class="player">

    </div>
    <div class="player">

    </div>
    <div class="player">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'testOutput',
    props: {
      msg: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .player {
    display: inline-block;
    width: 38vw;
    height: 38vw;
    border: 0.5vw solid rgba(255, 255, 255, .5);
    margin: 3vw;
  }
</style>

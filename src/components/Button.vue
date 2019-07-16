<template>
  <button>{{ text }}</button>
</template>

<script>
  export default {
    name: 'button',
    props: {
      text: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  button {
    display: inline-block;
    height: 18vw;
    width: 83vw;
    background-color: transparent;
    border: 0.5vw solid rgba(255, 255, 255, .5);
    color: white;
    font-size: 5vw;
    border-radius: 2vw;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
  }
</style>

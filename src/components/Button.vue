<template>
    <button>{{ text }}</button>
</template>

<script>
  export default {
    name: 'Button',
    props: {
      text: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  button {
    display: inline-block;
    width: 83vw;
    background-color: transparent;
    border: 0.5vw solid rgba(255, 255, 255, .5);
    color: white;
    font-size: 5vw;
    padding: 5vw;
    margin-bottom: 2vw;
  }
  button {
    border-radius: 2vw;
    margin: 3.5vw;
    height: 18vw;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
  }
</style>

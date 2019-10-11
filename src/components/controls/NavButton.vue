<template>
  <button :style="colorStyle">
    <span>{{ text }}</span>
  </button>
</template>

<script>
  export default {
    name: 'buttonComponent', // cant name as 'button' reserved word
    props: {
      text: String,
      color: { type: String, default: '' },
    },
    computed: {
      colorStyle() {
        if (this.color.toLowerCase() === 'grey') return `background-color: #504c42`;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  button {
    user-select: none;
    position: relative;
    display: inline-block;
    width: 100%;
    padding-top: 22%;
    color: white;
    border-radius: 0.2em;
    background-color: rgba(255, 136, 0, 1);
    border-top: none;
    border-bottom: 0.5em solid rgba(0, 0, 0, 0.3);
    border-left: 0.2em solid rgba(255, 255, 255, 0.3);
    border-right: 0.2em solid rgba(255, 255, 255, 0.3);
    margin-top: 0em;
    transition: background-color 0.05s, box-shadow 0.05s, margin-top 0.05s, border-bottom-width 0.05s;
    text-shadow: 0 0 0.1em rgba(0, 0, 0, .9);
    font-size: 0.8em;
  }
  button span {
    position: absolute;
    width: 100%;
    left: 0;
    top: 50%;
    height: 2em;
    line-height: 2em;
    margin-top: -1em;
    font-family: 'Black Ops One', arial;
    letter-spacing: 0.05em;
  }
  button:hover, button:focus {
    box-shadow: 0 0 1em black;
    outline: none;
  }
  button:active {
    border-bottom-width: 0em;
    margin-top: 0.5em;
  }
</style>

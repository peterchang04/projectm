  <!-- refactor this into higher order component -->
<template>
  <svg
     v-bind:width="width" v-bind:height="height" v-bind:class="classname"
  >
  </svg>
</template>

<script>
  export default {
    props: {
      classname: String,
      height: { type: Number, default: 24 },
      width: { type: Number, default: 24 }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

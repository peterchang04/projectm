<template>
  <div id="home">
    <div id="buttonsdiv">
      <div id="host">
        <Button text="HOST"/>
      </div>
      <div>
        ---------------- or ----------------
      </div>
      <div>
        <Button text="JOIN" />
      </div>
    </div>
  </div>
</template>

<script>
  import Button from './Button.vue';

  export default {
    name: 'home',
    components: { Button },
    props: {
      msg: String,
    },
  };

  </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #home {
    position: absolute;
    height: 160vw;
    top: 50%;
    margin-top: -80%;
  }
  #buttonsdiv{
    position: absolute;
    top: 25%;
    padding: 3vw 2.5vw;
  }
  #or {
    padding: 3vw 2.5vw;
  }
  #join {
    padding: 3vw 2.5vw;
  }
</style>

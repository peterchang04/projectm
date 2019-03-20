<template>
  <div id="targetsBar" class="proportionateHeightWrapper">
    <div class="content">
      <Target :index="0" callsign="WX" />
      <Target :index="1" />
      <Target :index="2" />
      <Target :index="3" />
    </div>
  </div>
</template>

<script>
  import Target from './Target.vue';

  export default {
    name: 'targetsBar',
    components: { Target },
    props: {
      msg: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* START This allows even height / width ratios across viewports */
  .proportionateHeightWrapper { position: absolute; width: 100%; }
  .proportionateHeightWrapper:before{ content: ""; display: block;
    padding-top: 16%; /* HEIGHT PROPORTION */
  }
  .proportionateHeightWrapper .content {
    position: absolute; top: 0; left: 0; bottom: 0; right: 0;
  }
  /* END This allows for proportionate height / width ratio across viewports */

  .content {
    text-align:left;
    z-index: 1100;
  }
  .content .target {
    display: inline-block;
    width: 25%;
    height: 100%;
  }
</style>
